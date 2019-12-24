import CursorChanger from '../../util/CursorChanger'
import LoadDialog from '../LoadDialog'
import getFromServer from './getFromServer'
import getJsonFromFile from './getJsonFromFile'
import SaveAnnotationDialog from '../SaveAnnotationDialog'
import SaveConfigurationDialog from '../SaveConfigurationDialog'
import AjaxSender from './AjaxSender'
import toLoadEvent from './toLoadEvent'

// A sub component to save and load data.
export default class {
  constructor(editor) {
    this._editor = editor

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
          this._editor.eventEmitter.emit(toLoadEvent(type), data)
          this.urlOfLastRead[type] = url
        },
        () => this.cursorChanger.endWait()
      )

    this.read = (type, file) =>
      getJsonFromFile(file, type, (data) =>
        this._editor.eventEmitter.emit(toLoadEvent(type), data)
      )

    this.ajaxSender = new AjaxSender(
      () => this.cursorChanger.startWait(),
      () => this._editor.eventEmitter.emit('textae.dataAccessObject.saveError'),
      () => this.cursorChanger.endWait()
    )

    editor.eventEmitter
      .on('textae.saveAnnotationDialog.url.click', (url, data) =>
        this.ajaxSender.post(url, data, () =>
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.save'
          )
        )
      )
      .on('textae.saveAnnotationDialog.download.click', () =>
        this._editor.eventEmitter.emit(
          'textae.dataAccessObject.annotation.save'
        )
      )
      .on('textae.saveAnnotationDialog.viewsource.click', () =>
        this._editor.eventEmitter.emit(
          'textae.dataAccessObject.annotation.save'
        )
      )
      .on('textae.saveConfigurationDialog.url.click', (url, data) => {
        // textae-config service is build with the Ruby on Rails 4.X.
        // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
        this.ajaxSender.patch(url, data, () =>
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.configuration.save'
          )
        )
      })
      .on('textae.saveConfigurationDialog.download.click', () =>
        this._editor.eventEmitter.emit(
          'textae.dataAccessObject.configuration.save'
        )
      )
  }

  getAnnotationFromServer(url) {
    this.load('annotation', url)
  }

  getConfigurationFromServer(url) {
    this.load('config', url)
  }

  showAccessAnno(hasChange) {
    new LoadDialog(
      'Load Annotations',
      this.urlOfLastRead.annotation,
      (url) => this.load('annotation', url),
      (file) => this.read('annotation', file),
      hasChange
    ).open()
  }

  showAccessConf(hasChange) {
    new LoadDialog(
      'Load Configurations',
      this.urlOfLastRead.config,
      (url) => this.load('config', url),
      (file) => this.read('config', file),
      hasChange
    ).open()
  }

  showSaveAnno(editedData, saveToParameter = null) {
    new SaveAnnotationDialog(
      this._editor,
      saveToParameter || this.urlOfLastRead.annotation,
      editedData
    ).open()
  }

  showSaveConf(originalData, editedData) {
    new SaveConfigurationDialog(
      this._editor,
      this.urlOfLastRead.config,
      originalData,
      editedData
    ).open()
  }
}
