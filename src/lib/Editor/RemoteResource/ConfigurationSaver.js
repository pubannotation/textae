import alertifyjs from 'alertifyjs'
import isServerPageAuthRequired from './isServerPageAuthRequired'
import openPopUp from './openPopUp'
import waitForPopUpClose from './waitForPopUpClose'

export default class ConfigurationSaver {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  saveTo(url, editedData) {
    if (!url) {
      return Promise.reject(new Error('no url'))
    }

    this.#eventEmitter.emit('textae-event.resource.startSave')

    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedData),
      credentials: 'include'
    }

    return fetch(url, opt)
      .then((response) => {
        if (response.ok) {
          this.#saved(editedData)
        } else if (response.status === 401) {
          const location = isServerPageAuthRequired(
            response.status,
            response.headers.get('WWW-Authenticate'),
            response.headers.get('Location')
          )
          if (location) {
            this.#authenticateAt(location, url, editedData)
          }
        } else {
          this.#failed()
        }
      })
      .catch(() => this.#failed())
      .finally(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
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
    if (window) {
      return waitForPopUpClose(window).then(() =>
        this.#retryPost(editedData, url)
      )
    }

    return Promise.reject(new Error('failed to open pop-up window'))
  }

  #retryPost(editedData, url) {
    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedData),
      credentials: 'include'
    }

    return fetch(url, opt).then((response) => {
      if (response.ok) {
        this.#saved(editedData)
      } else {
        this.#failed()
      }
    })
  }

  #failed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
