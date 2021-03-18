import LoadDialog from '../../../component/LoadDialog'
import SaveAnnotationDialog from '../../../component/SaveAnnotationDialog'
import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'
import mergeAnnotation from './mergeAnnotation'
import readAnnotationFile from './readAnnotationFile'
import readConfigurationFile from './readConfigurationFile'

export default class PersistenceInterface {
  constructor(
    editor,
    dataAccessObject,
    history,
    annotationData,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter
  ) {
    this._editor = editor
    this._dataAccessObject = dataAccessObject
    this._history = history
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
      this._history.hasAnythingToSaveAnnotation
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
      ({ files }) => {
        readConfigurationFile(files, this._editor)
        this._filenameOfLastRead.configuration = files[0].name
      },
      this._history.hasAnythingToSaveConfiguration
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
    return mergeAnnotation(
      this._getOriginalAnnotation(),
      this._annotationData,
      this._annotationData.typeDefinition.config
    )
  }
}
