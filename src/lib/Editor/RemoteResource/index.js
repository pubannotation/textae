import $ from 'jquery'
import alertifyjs from 'alertifyjs'
import DataSource from '../DataSource'
import isServerAuthRequired from './isServerAuthRequired'
import openPopUp from './openPopUp'

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
    console.assert(url, 'url is necessary!')

    this._eventEmitter.emit('textae-event.resource.startLoad')

    $.ajax({
      type: 'GET',
      url,
      cache: false,
      xhrFields: {
        withCredentials: false
      },
      timeout: 30000
    })
      .done((annotation) => this._annotationLoaded(url, annotation))
      .fail((jqXHR) => this._annotationLoadFirstFailed(jqXHR, url))
      .always(() => this._eventEmitter.emit('textae-event.resource.endLoad'))
  }

  // The second argument is the annotation you want to be notified of
  // when the configuration loading is complete.
  // This is supposed to be used when reading an annotation that does not contain a configuration
  // and then reading the configuration set by the attribute value of the textae-event.
  loadConfigulation(url, annotationDataSource = null) {
    console.assert(url, 'url is necessary!')

    this._eventEmitter.emit('textae-event.resource.startLoad')

    $.ajax({
      type: 'GET',
      url,
      cache: false,
      xhrFields: {
        withCredentials: true
      },
      timeout: 30000
    })
      .done((config) => this._configLoaded(url, config, annotationDataSource))
      .fail(() => this._configLoadFailed(url))
      .always(() => this._eventEmitter.emit('textae-event.resource.endLoad'))
  }

  saveAnnotation(url, editedData) {
    if (url) {
      this._eventEmitter.emit('textae-event.resource.startSave')

      const opt = {
        type: 'post',
        url,
        contentType: 'application/json',
        data: JSON.stringify(editedData),
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      }

      $.ajax(opt)
        .done(() => this._annotationSaved(editedData))
        .fail((jqXHR) =>
          this._annotationSaveFirstFailed(jqXHR, url, editedData)
        )
        .always(() => this._eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  saveConfiguration(url, editedData) {
    // textae-config service is build with the Ruby on Rails 4.X.
    // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
    if (url) {
      const data = JSON.stringify(editedData)

      this._eventEmitter.emit('textae-event.resource.startSave')

      $.ajax({
        type: 'patch',
        url,
        contentType: 'application/json',
        data,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      })
        .done(() => this._configSaved(editedData))
        .fail(() => this._configSaveFirstFailed(url, editedData))
        .always(() => this._eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  _annotationLoaded(url, annotation) {
    const dataSource = new DataSource('url', url, annotation)
    if (annotation && annotation.text) {
      this._eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        dataSource
      )
      this._eventEmitter.emit(
        'textae-event.resource.annotation.url.set',
        dataSource
      )
    } else {
      this._eventEmitter.emit(
        'textae-event.resource.annotation.format.error',
        dataSource
      )
    }
  }

  _annotationLoadFirstFailed(jqXHR, url) {
    if (jqXHR.status !== 401) {
      return this._annotationLoadFinalFailed(url)
    }

    // When authentication is requested, give credential and try again.
    $.ajax({
      type: 'GET',
      url,
      cache: false,
      xhrFields: {
        withCredentials: true
      },
      timeout: 30000
    })
      .done((annotation) => this._annotationLoaded(url, annotation))
      .fail(() => this._annotationLoadFinalFailed(url))
      .always(() => this._eventEmitter.emit('textae-event.resource.endLoad'))
  }

  _annotationLoadFinalFailed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this._eventEmitter.emit('textae-event.resource.annotation.load.error', url)
  }

  _configLoaded(url, config, annotationDataSource) {
    this._eventEmitter.emit(
      'textae-event.resource.configuration.load.success',
      new DataSource('url', url, config),
      annotationDataSource
    )
  }

  _configLoadFailed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this._eventEmitter.emit(
      'textae-event.resource.configuration.load.error',
      url
    )
  }

  _annotationSaved(editedData) {
    alertifyjs.success('annotation saved')
    this._eventEmitter.emit('textae-event.resource.annotation.save', editedData)
  }

  _annotationSaveFirstFailed(jqXHR, url, editedData) {
    // Authenticate in popup window.
    const location = isServerAuthRequired(
      jqXHR.status,
      jqXHR.getResponseHeader('WWW-Authenticate'),
      jqXHR.getResponseHeader('Location')
    )
    if (!location) {
      return this._annotationSaveFinalFailed()
    }

    const window = openPopUp(location)
    if (!window) {
      return this._annotationSaveFinalFailed()
    }

    // Watching for cross-domain pop-up windows to close.
    // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
    const timer = setInterval(() => {
      if (window.closed) {
        clearInterval(timer)

        const opt = {
          type: 'post',
          url,
          contentType: 'application/json',
          data: JSON.stringify(editedData),
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }

        // Retry after authentication.
        $.ajax(opt)
          .done(() => this._annotationSaved(editedData))
          .fail(() => this._annotationSaveFinalFailed)
          .always(() =>
            this._eventEmitter.emit('textae-event.resource.endSave')
          )
      }
    }, 1000)
  }

  _annotationSaveFinalFailed() {
    alertifyjs.error('could not save')
    this._eventEmitter.emit('textae-event.resource.save.error')
  }

  _configSaved(editedData) {
    alertifyjs.success('configuration saved')
    this._eventEmitter.emit(
      'textae-event.resource.configuration.save',
      editedData
    )
  }

  _configSaveFirstFailed(url, editedData) {
    {
      // Retry by a post method.
      this._eventEmitter.emit('textae-event.resource.startSave')

      $.ajax({
        type: 'post',
        url,
        contentType: 'application/json',
        data: JSON.stringify(editedData),
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      })
        .done(() => this._configSaved(editedData))
        .fail(() => this._configSaveFinalFailed())
        .always(() => this._eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  _configSaveFinalFailed() {
    alertifyjs.error('could not save')
    this._eventEmitter.emit('textae-event.resource.save.error')
  }
}
