import alertifyjs from 'alertifyjs'
import isServerAuthRequired from './isServerPageAuthRequired'
import openPopUp from './openPopUp'
import prepareRequestBody from './prepareRequestBody'

export default class AnnotationSaver {
  #format
  #eventEmitter

  constructor(format, eventEmitter) {
    this.#format = format
    this.#eventEmitter = eventEmitter
  }

  async saveTo(url, editedData) {
    if (!url) return

    this.#eventEmitter.emit('textae-event.resource.startSave')

    try {
      const requestBody = await prepareRequestBody(editedData, this.#format)
      const response = await this.#postTo(url, requestBody)

      await this.#processResponse(response, url, editedData)
    } catch (e) {
      this.#failed()
    } finally {
      this.#eventEmitter.emit('textae-event.resource.endSave')
    }
  }

  async #postTo(url, body) {
    const contentType =
      this.#format === 'json' ? 'application/json' : 'text/markdown'

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

  async #processResponse(response, url, editedData) {
    if (response.ok) {
      this.#saved(editedData)
    } else if (response.status === 401) {
      const location = isServerAuthRequired(
        response.status,
        response.headers.get('WWW-Authenticate'),
        response.headers.get('Location')
      )
      if (location) {
        await this.#authenticateAt(location, url, editedData)
      }
    } else {
      this.#failed()
    }
  }

  #saved(editedData) {
    alertifyjs.success('annotation saved')
    this.#eventEmitter.emit('textae-event.resource.annotation.save', editedData)
  }

  async #authenticateAt(location, url, editedData) {
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

    await this.#retryPost(editedData, url)
  }

  async #retryPost(editedData, url) {
    // Retry after authentication.
    try {
      const preparedBody = await prepareRequestBody(editedData, this.#format)
      const response = await this.#postTo(url, preparedBody)

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
