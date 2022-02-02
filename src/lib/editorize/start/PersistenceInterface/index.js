import LoadDialog from '../../../component/LoadDialog'
import SaveAnnotationDialog from '../../../component/SaveAnnotationDialog'
import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'
import readAnnotationFile from './readAnnotationFile'
import readConfigurationFile from './readConfigurationFile'
import DataSource from '../../DataSource'
import isJSON from './isJSON'

export default class PersistenceInterface {
  constructor(
    editor,
    remoteResource,
    annotationData,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter,
    annotationDataEventsObserver,
    buttonController
  ) {
    this._editor = editor
    this._remoteResource = remoteResource
    this._annotationData = annotationData
    this._getOriginalAnnotation = getOriginalAnnotation
    this._getOriginalConfig = getOriginalConfig
    this._saveToParameter = saveToParameter
    this._annotationDataEventsObserver = annotationDataEventsObserver
    this._buttonController = buttonController

    // Store the filename of the annotation and configuration.
    this._filenameOfLastRead = {
      annotation: '',
      configuration: ''
    }
  }

  importAnnotation() {
    new LoadDialog(
      'Load Annotations',
      this._remoteResource.annotationUrl,
      (url) => this._remoteResource.loadAnnotation(url),
      (file) => {
        readAnnotationFile(file, this._editor)
        this._filenameOfLastRead.annotation = file.name
      },
      (text) => {
        if (isJSON(text)) {
          const annotation = JSON.parse(text)
          if (annotation.text) {
            this._editor.eventEmitter.emit(
              'textae-event.resource.annotation.load.success',
              new DataSource('instant', null, annotation)
            )
            return
          }
        }

        this._editor.eventEmitter.emit(
          'textae-event.resource.annotation.format.error',
          new DataSource('instant', null)
        )
      },
      this._annotationDataEventsObserver.hasChange
    ).open()
  }

  uploadAnnotation() {
    new SaveAnnotationDialog(
      this._editor,
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
      (url) => this._remoteResource.loadConfigulation(url),
      (file) => {
        readConfigurationFile(file, this._editor)
        this._filenameOfLastRead.configuration = file.name
      },
      (text) => {
        if (isJSON(text)) {
          this._editor.eventEmitter.emit(
            'textae-event.resource.configuration.load.success',
            new DataSource('instant', null, JSON.parse(text))
          )
        } else {
          this._editor.eventEmitter.emit(
            'textae-event.resource.configuration.format.error',
            new DataSource('instant', null)
          )
        }
      },
      this._buttonController.diffOfConfiguration
    ).open()
  }

  uploadConfiguration() {
    // Merge with the original config and save the value unchanged in the editor.
    const editidConfig = {
      ...this._getOriginalConfig(),
      ...this._annotationData.typeDefinition.config
    }

    new SaveConfigurationDialog(
      this._editor,
      this._remoteResource.configurationUrl,
      this._filenameOfLastRead.configuration,
      this._getOriginalConfig(),
      editidConfig,
      (url) => this._remoteResource.saveConfiguration(url, editidConfig)
    ).open()
  }

  get _editedAnnotation() {
    return {
      ...this._getOriginalAnnotation(),
      ...this._annotationData.JSON,
      ...{
        config: this._annotationData.typeDefinition.config
      }
    }
  }
}
