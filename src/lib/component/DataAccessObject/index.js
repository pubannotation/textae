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
import save from './save'

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

  // The configuration validation is done with setConfigAndAnnotation
  // because it requires both configuration and annotation.
  // The URL is set after the validation.
  set configurationUrl(url) {
    this._urlOfLastRead.config = url
  }

  getAnnotationFromServer(url) {
    getFromServer(
      url,
      (source, annotation) => {
        if (annotation && annotation.text) {
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.load',
            'url',
            source,
            annotation,
            url
          )
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.setUrl',
            url
          )
          this._urlOfLastRead.annotation = url
        } else {
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.loadError',
            'url',
            source
          )
        }
      },
      this._cursorChanger
    )
  }

  // The second argument is the annotation you want to be notified of
  // when the configuration loading is complete.
  // This is supposed to be used when reading an annotation that does not contain a configuration
  // and then reading the configuration set by the attribute value of the textae.
  getConfigurationFromServer(url, annotation = null) {
    getFromServer(
      url,
      (source, config) => {
        this._editor.eventEmitter.emit(
          'textae.dataAccessObject.configuration.load',
          'url',
          source,
          config,
          annotation
        )
      },
      this._cursorChanger
    )
  }

  showAccessAnnotation(hasChange) {
    const readAnnotationFile = ({ files }) => {
      const file = files[0]

      readFile(file).then((event) => {
        const fileContent = event.target.result

        if (isTxtFile(file.name)) {
          // If this is .txt, New annotation json is made from .txt
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.annotation.load',
            'local file',
            file.name,
            {
              text: fileContent
            }
          )

          return
        }

        if (isJSON(fileContent)) {
          const annotation = JSON.parse(fileContent)

          if (annotation.text) {
            this._editor.eventEmitter.emit(
              'textae.dataAccessObject.annotation.load',
              'local file',
              file.name,
              annotation
            )

            return
          }
        }

        this._editor.eventEmitter.emit(
          'textae.dataAccessObject.annotation.loadError',
          'local file',
          file.name
        )
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

  showAccessConfiguration(hasChange) {
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
            'local file',
            file.name,
            parseData(event.target.result)
          )
        } else {
          this._editor.eventEmitter.emit(
            'textae.dataAccessObject.configuration.loadError',
            'local file',
            file.name
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

  showSaveAnnotation(editedData, saveToParameter) {
    new SaveAnnotationDialog(
      this._editor,
      saveToParameter || this._urlOfLastRead.annotation,
      editedData
    ).open()
  }

  saveAnnotation(editedData, saveToParameter) {
    const url = saveToParameter || this._urlOfLastRead.annotation
    if (url) {
      save(this._editor, this._ajaxSender, url, JSON.stringify(editedData))
    }
  }

  showSaveConfiguration(originalData, editedData) {
    new SaveConfigurationDialog(
      this._editor,
      this._urlOfLastRead.config,
      originalData,
      editedData
    ).open()
  }
}
