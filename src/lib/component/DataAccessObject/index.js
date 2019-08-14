import { EventEmitter } from 'events'
import CursorChanger from '../../util/CursorChanger'
import getLoadDialog from './getLoadDialog'
import getFromServer from './getFromServer'
import getJsonFromFile from './getJsonFromFile'
import getSaveDialog from './getSaveDialog'
import AjaxSender from './AjaxSender'
import addViewSource from './addViewSource'
import addJsonDiff from './addJsonDiff'

// A sub component to save and load data.
export default class extends EventEmitter {
  constructor(editor) {
    super()

    // Store the url the annotation data is loaded from per editor.
    this.urlOfLastRead = {
      annotation: '',
      config: ''
    }
    this.cursorChanger = new CursorChanger(editor)

    this.load = (type, url) =>
      getFromServer(
        url,
        () => this.cursorChanger.startWait(),
        ({ source, loadData }) => {
          const data = {
            source
          }
          data[type] = loadData
          super.emit(`load--${type}`, data)
          this.urlOfLastRead[type] = url
        },
        () => this.cursorChanger.endWait()
      )

    this.read = (type, file) =>
      getJsonFromFile(file, type, (data) => super.emit(`load--${type}`, data))

    this.ajaxSender = new AjaxSender(
      () => this.cursorChanger.startWait(),
      () => super.emit('save'),
      () => super.emit('save error'),
      () => this.cursorChanger.endWait()
    )
  }

  getAnnotationFromServer(url) {
    this.load('annotation', url)
  }

  getConfigurationFromServer(url) {
    this.load('config', url)
  }

  showAccessAnno(hasChange) {
    getLoadDialog(
      'Load Annotations',
      this.urlOfLastRead.annotation,
      (url) => this.load('annotation', url),
      (file) => this.read('annotation', file),
      hasChange
    ).open()
  }

  showAccessConf(hasChange) {
    getLoadDialog(
      'Load Configurations',
      this.urlOfLastRead.config,
      (url) => this.load('config', url),
      (file) => this.read('config', file),
      hasChange
    ).open()
  }

  showSaveAnno(editedData, saveToParameter = null) {
    getSaveDialog(
      'Save Annotations',
      'annotations.json',
      saveToParameter || this.urlOfLastRead.annotation,
      editedData,
      (url, data) => this.ajaxSender.post(url, data),
      (el, closeDialog) => addViewSource(el, editedData, this, closeDialog),
      () => super.emit('save')
    ).open()
  }

  showSaveConf(orig, edited) {
    getSaveDialog(
      'Save Configurations',
      'config.json',
      this.urlOfLastRead.config,
      edited.config,
      (url, data) => {
        // textae-config service is build with the Ruby on Rails 4.X.
        // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
        this.ajaxSender.patch(url, data)
      },
      (el) => addJsonDiff(el, orig, edited),
      () => super.emit('save--config')
    ).open()
  }
}
