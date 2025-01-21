import alertifyjs from 'alertifyjs'
import DataSource from '../../DataSource'
import parseResponse from './parseResponse'

export default class AnnotationLoader {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }
  async loadFrom(url) {
    console.assert(url, 'url is necessary!')

    this.#eventEmitter.emit('textae-event.resource.startLoad')
    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
          Accept: 'application/json, text/markdown'
        },
        signal: AbortSignal.timeout(30000)
      })

      if (response.ok) {
        const annotation = await parseResponse(response, url)
        this.#loaded(url, annotation)
      } else if (response.status === 401) {
        await this.#authenticate(url)
      } else {
        this.#failed(url)
      }
    } catch (e) {
      console.error(e)
      this.#failed(url)
    } finally {
      this.#eventEmitter.emit('textae-event.resource.endLoad')
    }
  }

  #loaded(url, annotation) {
    const dataSource = DataSource.createURLSource(url, annotation)
    if (annotation && annotation.text) {
      this.#eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        dataSource
      )
      this.#eventEmitter.emit(
        'textae-event.resource.annotation.url.set',
        dataSource
      )
    } else {
      this.#eventEmitter.emit(
        'textae-event.resource.annotation.format.error',
        dataSource
      )
    }
  }

  async #authenticate(url) {
    // When authentication is requested, give credential and try again.

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          Accept: 'application/json, text/markdown'
        },
        signal: AbortSignal.timeout(30000)
      })

      if (response.ok) {
        const annotation = await parseResponse(response, url)
        this.#loaded(url, annotation)
      } else if (response.status === 401) {
        await this.#authenticate(url)
      } else {
        this.#failed(url)
      }
    } catch (e) {
      console.error(e)
      this.#failed(url)
    }
  }

  #failed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this.#eventEmitter.emit('textae-event.resource.annotation.load.error', url)
  }
}
