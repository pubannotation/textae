import alertifyjs from 'alertifyjs'
import isServerPageAuthRequired from './isServerPageAuthRequired'
import openPopUp from './openPopUp'

export default class ConfigurationSaver {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  saveTo(url, editedData) {
    if (url) {
      this.#eventEmitter.emit('textae-event.resource.startSave')

      const opt = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'App-Name': 'TextAE'
        },
        body: JSON.stringify(editedData),
        credentials: 'include'
      }

      fetch(url, opt)
        .then((response) => {
          if (response.ok) {
            return this.#saved(editedData)
          } else if (response.status === 401) {
            const location = isServerPageAuthRequired(
              response.status,
              response.headers.get('WWW-Authenticate'),
              response.headers.get('Location')
            )
            if (location) {
              return this.#authenticateAt(location, url, editedData)
            }
          }

          this.#failed()
        })
        .finally(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  #saved(editedData) {
    alertifyjs.success('configuration saved')
    this.#eventEmitter.emit(
      'textae-event.resource.configuration.save',
      editedData
    )
  }

  #authenticateAt(location, url, editedData) {
    // Authenticate in popup window.
    const window = openPopUp(location)
    if (!window) {
      return this.#failed()
    }

    // Watching for cross-domain pop-up windows to close.
    // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
    const timer = setInterval(() => {
      clearInterval(timer)
      this.#retryPost(editedData, url)
    }, 1000)
  }

  #retryPost(editedData, url) {
    {
      const opt = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedData),
        credentials: 'include'
      }

      fetch(url, opt).then((response) => {
        if (response.ok) {
          this.#saved(editedData)
        } else {
          this.#failed()
        }
      })
    }
  }

  #failed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
