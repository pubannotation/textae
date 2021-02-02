import CursorChanger from '../../util/CursorChanger'
import AjaxSender from './AjaxSender'
import bind from './bind'
import get from './get'
import post from './post'
import patch from './patch'

// A sub component to save and load data.
export default class DataAccessObject {
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
      () =>
        this._editor.eventEmitter.emit(
          'textae-event.data-access-object.save.error'
        ),
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

  loadAnnotation(url) {
    get(
      url,
      (source, annotation) => {
        if (annotation && annotation.text) {
          this._editor.eventEmitter.emit(
            'textae-event.annotation.load',
            'url',
            source,
            annotation,
            url
          )
          this._editor.eventEmitter.emit('textae-event.annotation.setUrl', url)
          this._urlOfLastRead.annotation = url
        } else {
          this._editor.eventEmitter.emit(
            'textae-event.annotation.loadError',
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
  // and then reading the configuration set by the attribute value of the textae-event.
  loadConfigulation(url, annotation = null) {
    get(
      url,
      (source, config) => {
        this._editor.eventEmitter.emit(
          'textae-event.configuration.load',
          'url',
          source,
          config,
          annotation
        )
      },
      this._cursorChanger
    )
  }

  saveAnnotation(url, editedData) {
    if (url) {
      post(
        this._editor,
        this._ajaxSender,
        url,
        JSON.stringify(editedData),
        'taxtae-event.annotation-data.save'
      )
    }
  }

  saveConfiguration(url, editedData) {
    // textae-config service is build with the Ruby on Rails 4.X.
    // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
    if (url) {
      patch(
        this._editor,
        this._ajaxSender,
        url,
        JSON.stringify(editedData),
        'textae-event.configuration.save'
      )
    }
  }
}
