import LoadAnnotationDialog from '../../../component/LoadAnnotationDialog'
import LoadConfigurationDialog from '../../../component/LoadConfigurationDialog'
import SaveAnnotationDialog from '../../../component/SaveAnnotationDialog'
import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'
import readAnnotationFile from './readAnnotationFile'
import readConfigurationFile from './readConfigurationFile'
import DataSource from '../../DataSource'
import isJSON from '../../../isJSON'
import readAnnotationText from './readAnnotationText'
import LastLoadedURL from './LastLoadedURL.js'
import LastLoadedFilename from './LastLoadedFilename.js'

export default class PersistenceInterface {
  #eventEmitter
  #remoteResource
  #annotationModel
  #getOriginalAnnotation
  #getOriginalConfig
  #saveToParameter
  #annotationModelEventsObserver
  #menuState
  #lastLoadedURL
  #lastLoadedFilename

  /**
   *
   * @param {import('../../RemoteResource/index.js').default} remoteResource
   */
  constructor(
    eventEmitter,
    remoteResource,
    annotationModel,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter,
    annotationModelEventsObserver,
    menuState
  ) {
    this.#eventEmitter = eventEmitter
    this.#remoteResource = remoteResource
    this.#annotationModel = annotationModel
    this.#getOriginalAnnotation = getOriginalAnnotation
    this.#getOriginalConfig = getOriginalConfig
    this.#saveToParameter = saveToParameter
    this.#annotationModelEventsObserver = annotationModelEventsObserver
    this.#menuState = menuState
    this.#lastLoadedURL = new LastLoadedURL(eventEmitter)
    this.#lastLoadedFilename = new LastLoadedFilename(eventEmitter)

    eventEmitter
      .on('textae-event.pallet.import-button.click', () =>
        this.importConfiguration()
      )
      .on('textae-event.pallet.upload-button.click', () =>
        this.uploadConfiguration()
      )
  }

  importAnnotation() {
    new LoadAnnotationDialog(
      'Load Annotations',
      this.#lastLoadedURL.annotation,
      (url) => this.#remoteResource.loadAnnotation(url),
      (file) => readAnnotationFile(file, this.#eventEmitter),
      async (text, format) =>
        await readAnnotationText(this.#eventEmitter, text, format),
      this.#annotationModelEventsObserver.hasChange
    ).open()
  }

  uploadAnnotation() {
    const url =
      this.#saveToParameter ||
      this.#lastLoadedURL.annotation ||
      'https://pubannotatoin.org/annotations.json' // Default destination URL

    new SaveAnnotationDialog(
      this.#eventEmitter,
      url,
      this.#lastLoadedFilename.annotation,
      this.#editedAnnotation,
      (url, format) =>
        this.#remoteResource.saveAnnotation(url, this.#editedAnnotation, format)
    ).open()
  }

  saveAnnotation() {
    this.#remoteResource.saveAnnotation(
      this.#saveToParameter || this.#lastLoadedURL.annotation,
      this.#editedAnnotation,
      'json'
    )
  }

  importConfiguration() {
    new LoadConfigurationDialog(
      'Load Configurations',
      this.#lastLoadedURL.configuration,
      (url) => this.#remoteResource.loadConfiguration(url),
      (file) => readConfigurationFile(file, this.#eventEmitter),
      (text) => {
        if (isJSON(text)) {
          this.#eventEmitter.emit(
            'textae-event.resource.configuration.load.success',
            DataSource.createInstantSource(JSON.parse(text))
          )
        } else {
          this.#eventEmitter.emit(
            'textae-event.resource.configuration.format.error',
            DataSource.createInstantSource()
          )
        }
      },
      this.#menuState.diffOfConfiguration
    ).open()
  }

  uploadConfiguration() {
    // Merge with the original config and save the value unchanged in the editor.
    const editedConfig = {
      ...this.#getOriginalConfig(),
      ...this.#annotationModel.typeDictionary.config
    }

    new SaveConfigurationDialog(
      this.#eventEmitter,
      this.#lastLoadedURL.configuration,
      this.#lastLoadedFilename.configuration,
      this.#getOriginalConfig(),
      editedConfig,
      (url) => this.#remoteResource.saveConfiguration(url, editedConfig)
    ).open()
  }

  get #editedAnnotation() {
    const annotation = {
      ...this.#getOriginalAnnotation(),
      ...this.#annotationModel.externalFormat,
      ...{
        config: this.#annotationModel.typeDictionary.config
      }
    }

    // Track annotations are merged into root annotations.
    delete annotation.tracks

    return annotation
  }
}
