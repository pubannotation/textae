import get from './get'
import DataSource from '../DataSource'
import post from './post'
import patch from './patch'

// A sub component to save and load data.
export default class RemoteSource {
  constructor(eventEmitter) {
    this._eventEmitter = eventEmitter

    // Store the url the annotation data is loaded from per editor.
    this._urlOfLastRead = {
      annotation: '',
      config: ''
    }
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
          this._eventEmitter.emit(
            'textae-event.data-access-object.annotation.load.success',
            dataSource
          )
          this._eventEmitter.emit(
            'textae-event.data-access-object.annotation.url.set',
            dataSource
          )
        } else {
          this._eventEmitter.emit(
            'textae-event.data-access-object.annotation.format.error',
            dataSource
          )
        }
      },
      () =>
        this._eventEmitter.emit(
          'textae-event.data-access-object.annotation.load.error',
          url
        ),
      this._eventEmitter
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
        this._eventEmitter.emit(
          'textae-event.data-access-object.configuration.load.success',
          new DataSource('url', url, config),
          annotationDataSource
        )
      },
      () =>
        this._eventEmitter.emit(
          'textae-event.data-access-object.configuration.load.error',
          url
        ),
      this._eventEmitter
    )
  }

  saveAnnotation(url, editedData) {
    if (url) {
      post(
        url,
        JSON.stringify(editedData),
        () =>
          this._eventEmitter.emit('textae-event.data-access-object.startSave'),
        () =>
          this._eventEmitter.emit(
            'textae-event.data-access-object.annotation.save',
            editedData
          ),
        () =>
          this._eventEmitter.emit('textae-event.data-access-object.save.error'),
        () => this._eventEmitter.emit('textae-event.data-access-object.endSave')
      )
    }
  }

  saveConfiguration(url, editedData) {
    // textae-config service is build with the Ruby on Rails 4.X.
    // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
    if (url) {
      patch(
        url,
        JSON.stringify(editedData),
        () =>
          this._eventEmitter.emit('textae-event.data-access-object.startSave'),
        () =>
          this._eventEmitter.emit(
            'textae-event.data-access-object.configuration.save',
            editedData
          ),
        () =>
          this._eventEmitter.emit('textae-event.data-access-object.save.error'),
        () => this._eventEmitter.emit('textae-event.data-access-object.endSave')
      )
    }
  }
}
