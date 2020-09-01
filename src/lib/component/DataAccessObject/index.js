import CursorChanger from '../../util/CursorChanger'
import getFromServer from './getFromServer'
import AjaxSender from './AjaxSender'
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
      () => this._editor.eventEmitter.emit('textae.saveError'),
      () => this._cursorChanger.endWait()
    )

    bind(editor, this._ajaxSender)
  }

  get annotationUrl() {
    return this._urlOfLastRead.annotation
  }

  get configurationUrl() {
    return this._urlOfLastRead.config
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
            'textae.annotation.load',
            'url',
            source,
            annotation,
            url
          )
          this._editor.eventEmitter.emit(
            'textae.annotation.setUrl',
            url
          )
          this._urlOfLastRead.annotation = url
        } else {
          this._editor.eventEmitter.emit(
            'textae.annotation.loadError',
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
          'textae.configuration.load',
          'url',
          source,
          config,
          annotation
        )
      },
      this._cursorChanger
    )
  }

  saveAnnotation(editedData, saveToParameter) {
    const url = saveToParameter || this._urlOfLastRead.annotation
    if (url) {
      save(this._editor, this._ajaxSender, url, JSON.stringify(editedData))
    }
  }
}
