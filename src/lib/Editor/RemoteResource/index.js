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
        withCredentials: true
      },
      timeout: 30000
    })
      .done((annotation) => {
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
      })
      .fail(() => {
        alertifyjs.error(
          `Could not load the file from the location you specified.: ${url}`
        )
        this._eventEmitter.emit(
          'textae-event.resource.annotation.load.error',
          url
        )
      })
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
      .done((config) => {
        this._eventEmitter.emit(
          'textae-event.resource.configuration.load.success',
          new DataSource('url', url, config),
          annotationDataSource
        )
      })
      .fail(() => {
        alertifyjs.error(
          `Could not load the file from the location you specified.: ${url}`
        )
        this._eventEmitter.emit(
          'textae-event.resource.configuration.load.error',
          url
        )
      })
      .always(() => this._eventEmitter.emit('textae-event.resource.endLoad'))
  }

  saveAnnotation(url, editedData) {
    if (url) {
      this._eventEmitter.emit('textae-event.resource.startSave')

      requestAjax(
        'post',
        url,
        JSON.stringify(editedData),
        () => {
          alertifyjs.success('annotation saved')
          this._eventEmitter.emit(
            'textae-event.resource.annotation.save',
            editedData
          )
        },
        () => {
          alertifyjs.error('could not save')
          this._eventEmitter.emit('textae-event.resource.save.error')
        },
        () => this._eventEmitter.emit('textae-event.resource.endSave')
      )
    }
  }

  saveConfiguration(url, editedData) {
    // textae-config service is build with the Ruby on Rails 4.X.
    // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
    if (url) {
      const data = JSON.stringify(editedData)
      const successHandler = () => {
        alertifyjs.success('configuration saved')
        this._eventEmitter.emit(
          'textae-event.resource.configuration.save',
          editedData
        )
      }

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
        .done(successHandler)
        .fail(() => {
          // Retry by a post method.
          this._eventEmitter.emit('textae-event.resource.startSave')

          $.ajax({
            type: 'post',
            url,
            contentType: 'application/json',
            data,
            crossDomain: true,
            xhrFields: {
              withCredentials: true
            }
          })
            .done(successHandler)
            .fail(() => {
              alertifyjs.error('could not save')
              this._eventEmitter.emit('textae-event.resource.save.error')
            })
            .always(() =>
              this._eventEmitter.emit('textae-event.resource.endSave')
            )
        })
        .always(() => this._eventEmitter.emit('textae-event.resource.endSave'))
    }
  }
}

function requestAjax(
  type,
  url,
  data,
  successHandler,
  failHandler,
  finishHandler
) {
  const opt = {
    type,
    url,
    contentType: 'application/json',
    data,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
  }

  $.ajax(opt)
    .done(successHandler)
    .fail((response) => {
      // Authenticate in popup window.
      const location = isServerAuthRequired(response)
      if (!location) {
        return failHandler()
      }

      const window = openPopUp(location)
      if (!window) {
        return failHandler()
      }

      // Watching for cross-domain pop-up windows to close.
      // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
      const timer = setInterval(() => {
        if (window.closed) {
          clearInterval(timer)

          // Retry after authentication.
          $.ajax(opt)
            .done(successHandler)
            .fail(failHandler)
            .always(finishHandler)
        }
      }, 1000)
    })
    .always(finishHandler)
}
