import LoadDialog from '../../../component/LoadDialog'
import SaveAnnotationDialog from '../../../component/SaveAnnotationDialog'
import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'
import readAnnotationFile from './readAnnotationFile'
import readConfigurationFile from './readConfigurationFile'
import DataSource from '../../DataSource'
import isJSON from '../../../isJSON'
import readAnnotationText from './readAnnotationText'

export default class PersistenceInterface {
  constructor(
    eventEmitter,
    remoteResource,
    annotationModel,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter,
    annotationModelEventsObserver,
    controlViewModel
  ) {
    this._eventEmitter = eventEmitter
    this._remoteResource = remoteResource
    this._annotationModel = annotationModel
    this._getOriginalAnnotation = getOriginalAnnotation
    this._getOriginalConfig = getOriginalConfig
    this._saveToParameter = saveToParameter
    this._annotationModelEventsObserver = annotationModelEventsObserver
    this._controlViewModel = controlViewModel

    // Store the filename of the annotation and configuration.
    this._filenameOfLastRead = {
      annotation: '',
      configuration: ''
    }

    eventEmitter
      .on('textae-event.pallet.import-button.click', () =>
        this.importConfiguration()
      )
      .on('textae-event.pallet.upload-button.click', () =>
        this.uploadConfiguration()
      )
  }

  importAnnotation() {
    new LoadDialog(
      'Load Annotations',
      this._remoteResource.annotationUrl,
      (url) => this._remoteResource.loadAnnotation(url),
      (file) => {
        readAnnotationFile(file, this._eventEmitter)
        this._filenameOfLastRead.annotation = file.name
      },
      (text) => {
        if (readAnnotationText(this._eventEmitter, text)) {
          return
        }

        this._eventEmitter.emit(
          'textae-event.resource.annotation.format.error',
          new DataSource('instant', null)
        )
      },
      this._annotationModelEventsObserver.hasChange
    ).open()
  }

  uploadAnnotation() {
    new SaveAnnotationDialog(
      this._eventEmitter,
      this._saveToParameter || this._remoteResource.annotationUrl,
      this._filenameOfLastRead.annotation,
      this._editedAnnotation,
      (url) => this._remoteResource.saveAnnotation(url, this._editedAnnotation)
    ).open()
  }

  saveAnnotation() {
    this._remoteResource.saveAnnotation(
      this._saveToParameter || this._remoteResource.annotationUrl,
      this._editedAnnotation
    )
  }

  importConfiguration() {
    new LoadDialog(
      'Load Configurations',
      this._remoteResource.configurationUrl,
      (url) => this._remoteResource.loadConfiguration(url),
      (file) => {
        readConfigurationFile(file, this._eventEmitter)
        this._filenameOfLastRead.configuration = file.name
      },
      (text) => {
        if (isJSON(text)) {
          this._eventEmitter.emit(
            'textae-event.resource.configuration.load.success',
            new DataSource('instant', null, JSON.parse(text))
          )
        } else {
          this._eventEmitter.emit(
            'textae-event.resource.configuration.format.error',
            new DataSource('instant', null)
          )
        }
      },
      this._controlViewModel.diffOfConfiguration
    ).open()
  }

  uploadConfiguration() {
    // Merge with the original config and save the value unchanged in the editor.
    const editedConfig = {
      ...this._getOriginalConfig(),
      ...this._annotationModel.typeDefinition.config
    }

    new SaveConfigurationDialog(
      this._eventEmitter,
      this._remoteResource.configurationUrl,
      this._filenameOfLastRead.configuration,
      this._getOriginalConfig(),
      editedConfig,
      (url) => this._remoteResource.saveConfiguration(url, editedConfig)
    ).open()
  }

  get _editedAnnotation() {
    const annotation = {
      ...this._getOriginalAnnotation(),
      ...this._annotationModel.externalFormat,
      ...{
        config: this._annotationModel.typeDefinition.config
      }
    }

    // Track annotations are merged into root annotations.
    delete annotation.tracks

    return annotation
  }
}
