import alertifyjs from 'alertifyjs'
import isServerAuthRequired from './isServerPageAuthRequired'
import openPopUp from './openPopUp'
import prepareRequestBody from './prepareRequestBody'

export default class AnnotationSaver {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  saveTo(url, editedData, format = 'json') {
    if (url) {
      this.#eventEmitter.emit('textae-event.resource.startSave')

      prepareRequestBody(editedData, format)
        .then(this.#postTo(url, format))
        .then(this.#processResponse(url, editedData, format))
        .catch(() => this.#failed())
        .finally(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  #postTo(url, format) {
    const contentType = format === 'json' ? 'application/json' : 'text/markdown'

    return (body) => {
      const opt = {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          'App-Name': 'TextAE'
        },
        body,
        credentials: 'include'
      }

      return fetch(url, opt)
    }
  }

  #processResponse(url, editedData, format) {
    return (response) => {
      if (response.ok) {
        return this.#saved(editedData)
      } else if (response.status === 401) {
        const location = isServerAuthRequired(
          response.status,
          response.headers.get('WWW-Authenticate'),
          response.headers.get('Location')
        )
        if (location) {
          return this.#authenticateAt(location, url, editedData, format)
        }
      }

      this.#failed()
    }
  }

  #saved(editedData) {
    alertifyjs.success('annotation saved')
    this.#eventEmitter.emit('textae-event.resource.annotation.save', editedData)
  }

  #authenticateAt(location, url, editedData, format) {
    // Authenticate in popup window.
    const window = openPopUp(location)
    if (!window) {
      return this.#failed()
    }

    // Watching for cross-domain pop-up windows to close.
    // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
    const timer = setInterval(() => {
      if (window.closed) {
        clearInterval(timer)

        this.#retryPost(editedData, url, format)
      }
    }, 1000)
  }

  #retryPost(editedData, url, format) {
    // Retry after authentication.
    prepareRequestBody(editedData, format)
      .then(this.#postTo(url))
      .then((response) => {
        if (response.ok) {
          this.#saved(url, editedData)
        } else {
          this.#failed()
        }
      })
      .catch(() => this.#failed())
  }

  #failed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
