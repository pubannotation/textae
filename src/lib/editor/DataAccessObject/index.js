import CursorChanger from '../../util/CursorChanger'
import AjaxSender from './AjaxSender'
import bind from './bind'
import get from './get'
import post from './post'
import patch from './patch'
import DataSource from '../DataSource'

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

  set annotationUrl(dataSource) {
    if (dataSource.type === 'url') {
      this._urlOfLastRead.annotation = dataSource.id
    }
  }

  get configurationUrl() {
    return this._urlOfLastRead.config
  }

  // The configuration validation is done with setConfigAndAnnotation
  // because it requires both configuration and annotation.
  // The URL is set after the validation.
  set configurationUrl(dataSource) {
    if (dataSource.type === 'url') {
      this._urlOfLastRead.config = dataSource.id
    }
  }

  loadAnnotation(url) {
    get(
      url,
      (annotation) => {
        const dataSource = new DataSource('url', url, annotation)
        if (annotation && annotation.text) {
          this._editor.eventEmitter.emit(
            'textae-event.data-access-object.annotation.load.success',
            dataSource
          )
          this._editor.eventEmitter.emit(
            'textae-event.data-access-object.annotation.url.set',
            dataSource
          )
        } else {
          this._editor.eventEmitter.emit(
            'textae-event.data-access-object.annotation.load.error',
            dataSource
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
  loadConfigulation(url, annotationDataSource = null) {
    get(
      url,
      (config) => {
        this._editor.eventEmitter.emit(
          'textae-event.data-access-object.configuration.load.success',
          new DataSource('url', url, config),
          annotationDataSource
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
        'textae-event.data-access-object.annotation.save'
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
        'textae-event.data-access-object.configuration.save'
      )
    }
  }
}
