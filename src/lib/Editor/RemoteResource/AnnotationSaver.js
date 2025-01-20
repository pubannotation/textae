import alertifyjs from 'alertifyjs'
import isServerAuthRequired from './isServerPageAuthRequired'
import openPopUp from './openPopUp'
import prepareRequestBody from './prepareRequestBody'

export default class AnnotationSaver {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  async saveTo(url, editedData, format) {
    if (!url) return

    this.#eventEmitter.emit('textae-event.resource.startSave')

    try {
      const requestBody = await prepareRequestBody(editedData, format)
      const response = await this.#postTo(url, format, requestBody)

      await this.#processResponse(response, url, editedData, format)
    } catch (e) {
      this.#failed()
    } finally {
      this.#eventEmitter.emit('textae-event.resource.endSave')
    }
  }

  async #postTo(url, format, body) {
    const contentType = format === 'json' ? 'application/json' : 'text/markdown'

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

  async #processResponse(response, url, editedData, format) {
    if (response.ok) {
      this.#saved(editedData)
    } else if (response.status === 401) {
      const location = isServerAuthRequired(
        response.status,
        response.headers.get('WWW-Authenticate'),
        response.headers.get('Location')
      )
      if (location) {
        await this.#authenticateAt(location, url, editedData, format)
      }
    } else {
      this.#failed()
    }
  }

  #saved(editedData) {
    alertifyjs.success('annotation saved')
    this.#eventEmitter.emit('textae-event.resource.annotation.save', editedData)
  }

  async #authenticateAt(location, url, editedData, format) {
    // Authenticate in popup window.
    const window = openPopUp(location)
    if (!window) {
      return this.#failed()
    }

    // Watching for cross-domain pop-up windows to close.
    // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
    await new Promise((resolve) => {
      const timer = setInterval(() => {
        if (window.closed) {
          clearInterval(timer)
          resolve()
        }
      }, 1000)
    })

    await this.#retryPost(editedData, url, format)
  }

  async #retryPost(editedData, url, format) {
    // Retry after authentication.
    try {
      const preparedBody = await prepareRequestBody(editedData, format)
      const response = await this.#postTo(url, format, preparedBody)

      if (response.ok) {
        this.#saved(editedData)
      } else {
        this.#failed()
      }
    } catch (e) {
      this.#failed()
    }
  }

  #failed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
