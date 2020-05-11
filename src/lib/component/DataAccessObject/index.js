import CursorChanger from '../../util/CursorChanger'
import LoadDialog from '../LoadDialog'
import getFromServer from './getFromServer'
import readFile from './readFile'
import SaveAnnotationDialog from '../SaveAnnotationDialog'
import SaveConfigurationDialog from '../SaveConfigurationDialog'
import AjaxSender from './AjaxSender'
import isJSON from './isJSON'
import isTxtFile from './isTxtFile'
import bind from './bind'

// A sub component to save and load data.
export default class {
  constructor(editor) {
    this._editor = editor

    // Store the url the annotation data is loaded from per editor.
    this._urlOfLastRead = {
      annotation: '',
      config: ''
    }
    this._cursorChanger = new CursorChanger(editor)
    this._ajaxSender = new AjaxSender(
      () => this._cursorChanger.startWait(),
      () => this._editor.eventEmitter.emit('textae.dataAccessObject.saveError'),
      () => this._cursorChanger.endWait()
    )

    bind(editor, this._ajaxSender)
  }

  getAnnotationFromServer(url) {
    getFromServer(
      url,
      () => this._cursorChanger.startWait(),
      ({ source, loadData: annotation }) => {
        this._editor.eventEmitter.emit(
          'textae.dataAccessObject.annotation.load',
          source,
          annotation
        )
        this._urlOfLastRead.annotation = url
      },
      () => this._cursorChanger.endWait()
    )
  }

  getConfigurationFromServer(url) {
    getFromServer(
      url,
      () => this._cursorChanger.startWait(),
      ({ source, loadData: config }) => {
        this._editor.eventEmitter.emit(
          'textae.dataAccessObject.configuration.load',
          source,
          config
        )
        this._urlOfLastRead.config = url
      },
      () => this._cursorChanger.endWait()
    )
  }

  showAccessAnno(hasChange) {
    const readAnnotationFile = ({ files }) => {
      const file = files[0]

      readFile(file).then((event) => {
        const source = `${file.name}(local file)`

        if (isJSON(event.target.result)) {
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.load',
            source,
            JSON.parse(event.target.result)
          )
        } else if (isTxtFile(file.name)) {
          // If this is .txt, New annotation json is made from .txt
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.load',
            source,
            {
              text: event.target.result
            }
          )
        } else {
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.loadError',
            source
          )
        }
      })
    }

    new LoadDialog(
      'Load Annotations',
      this._urlOfLastRead.annotation,
      (url) => this.getAnnotationFromServer(url),
      readAnnotationFile,
      hasChange
    ).open()
  }

  showAccessConf(hasChange) {
    function parseData(result) {
      if (isJSON(result)) {
        return JSON.parse(result)
      }
      return null
    }

    const readConfigurationFile = ({ files }) => {
      const file = files[0]

      readFile(file).then((event) => {
        if (isJSON(event.target.result)) {
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.configuration.load',
            `${file.name}(local file)`,
            parseData(event.target.result)
          )
        } else {
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.configuration.loadError',
            `${file.name}(local file)`
          )
        }
      })
    }

    new LoadDialog(
      'Load Configurations',
      this._urlOfLastRead.config,
      (url) => this.getConfigurationFromServer(url),
      readConfigurationFile,
      hasChange
    ).open()
  }

  showSaveAnno(editedData, saveToParameter = null) {
    new SaveAnnotationDialog(
      this._editor,
      saveToParameter || this._urlOfLastRead.annotation,
      editedData
    ).open()
  }

  showSaveConf(originalData, editedData) {
    new SaveConfigurationDialog(
      this._editor,
      this._urlOfLastRead.config,
      originalData,
      editedData
    ).open()
  }
}
