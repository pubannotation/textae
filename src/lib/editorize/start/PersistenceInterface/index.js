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
    dataAccessObject,
    annotationDataEventsObserver,
    annotationData,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter
  ) {
    this._editor = editor
    this._dataAccessObject = dataAccessObject
    this._annotationDataEventsObserver = annotationDataEventsObserver
    this._annotationData = annotationData
    this._getOriginalAnnotation = getOriginalAnnotation
    this._getOriginalConfig = getOriginalConfig
    this._saveToParameter = saveToParameter

    // Store the filename of the annotation and configuration.
    this._filenameOfLastRead = {
      annotation: '',
      configuration: ''
    }
  }

  importAnnotation() {
    new LoadDialog(
      'Load Annotations',
      this._dataAccessObject.annotationUrl,
      (url) => this._dataAccessObject.loadAnnotation(url),
      (file) => {
        readAnnotationFile(file, this._editor)
        this._filenameOfLastRead.annotation = file.name
      },
      (text) => {
        if (isJSON(text)) {
          const annotation = JSON.parse(text)
          if (annotation.text) {
            this._editor.eventEmitter.emit(
              'textae-event.data-access-object.annotation.load.success',
              new DataSource('instant', null, annotation)
            )
            return
          }
        }

        this._editor.eventEmitter.emit(
          'textae-event.data-access-object.annotation.format.error',
          new DataSource('instant', null)
        )
      },
      this._annotationDataEventsObserver.hasChange
    ).open()
  }

  uploadAnnotation() {
    new SaveAnnotationDialog(
      this._editor,
      this._saveToParameter || this._dataAccessObject.annotationUrl,
      this._filenameOfLastRead.annotation,
      this._editedAnnotation,
      (url) =>
        this._dataAccessObject.saveAnnotation(url, this._editedAnnotation)
    ).open()
  }

  saveAnnotation() {
    this._dataAccessObject.saveAnnotation(
      this._saveToParameter || this._dataAccessObject.annotationUrl,
      this._editedAnnotation
    )
  }

  importConfiguration() {
    new LoadDialog(
      'Load Configurations',
      this._dataAccessObject.configurationUrl,
      (url) => this._dataAccessObject.loadConfigulation(url),
      (file) => {
        readConfigurationFile(file, this._editor)
        this._filenameOfLastRead.configuration = file.name
      },
      (text) => {
        if (isJSON(text)) {
          this._editor.eventEmitter.emit(
            'textae-event.data-access-object.configuration.load.success',
            new DataSource('instant', null, JSON.parse(text))
          )
        } else {
          this._editor.eventEmitter.emit(
            'textae-event.data-access-object.configuration.format.error',
            new DataSource('instant', null)
          )
        }
      },
      this._annotationDataEventsObserver.hasAnythingToSaveConfiguration
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
      this._dataAccessObject.configurationUrl,
      this._filenameOfLastRead.configuration,
      this._getOriginalConfig(),
      editidConfig,
      (url) => this._dataAccessObject.saveConfiguration(url, editidConfig)
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
