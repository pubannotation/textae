import alertifyjs from 'alertifyjs'
import DataSource from '../DataSource'

export default class ConfigurationLoader {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  // The second argument is the annotation you want to be notified of
  // when the configuration loading is complete.
  // This is supposed to be used when reading an annotation that does not contain a configuration
  // and then reading the configuration set by the attribute value of the textae-event.
  loadFrom(url, annotationModelSource) {
    console.assert(url, 'url is necessary!')

    this.#eventEmitter.emit('textae-event.resource.startLoad')

    fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(30000)
    })
      .then((response) => {
        if (response.ok) {
          return response
            .json()
            .then((config) => this.#loaded(url, config, annotationModelSource))
        } else {
          this.#failed(url)
        }
      })
      .catch(() => this.#failed(url))
      .finally(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
  }

  #loaded(url, config, annotationModelSource) {
    this.#eventEmitter.emit(
      'textae-event.resource.configuration.load.success',
      DataSource.createURLSource(url, config),
      annotationModelSource
    )
  }

  #failed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this.#eventEmitter.emit(
      'textae-event.resource.configuration.load.error',
      url
    )
  }
}
