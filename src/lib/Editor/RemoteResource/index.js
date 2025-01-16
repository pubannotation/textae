import AnnotationLoader from './AnnotationLoader'
import ConfigurationLoader from './ConfigurationLoader'
import AnnotationSaver from './AnnotationSaver'
import ConfigurationSaver from './ConfigurationSaver'

// A sub component to save and load data.
export default class RemoteSource {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  loadAnnotation(url) {
    new AnnotationLoader(this.#eventEmitter).loadFrom(url)
  }

  loadConfiguration(url, annotationModelSource = null) {
    new ConfigurationLoader(this.#eventEmitter).loadFrom(
      url,
      annotationModelSource
    )
  }

  saveAnnotation(url, editedData, format) {
    new AnnotationSaver(this.#eventEmitter).saveTo(url, editedData, format)
  }

  saveConfiguration(url, editedData) {
    new ConfigurationSaver(this.#eventEmitter).saveTo(url, editedData)
  }
}
