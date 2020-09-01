import LoadDialog from '../../../component/LoadDialog'
import SaveAnnotationDialog from '../../../component/SaveAnnotationDialog'
import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'
import mergeAnnotation from './mergeAnnotation'
import readAnnotationFile from './readAnnotationFile'
import readConfigurationFile from './readConfigurationFile'

export default class {
  constructor(
    editor,
    dataAccessObject,
    history,
    annotationData,
    typeDefinition,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter
  ) {
    this._editor = editor
    this._dataAccessObject = dataAccessObject
    this._history = history
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._getOriginalAnnotation = getOriginalAnnotation
    this._getOriginalConfig = getOriginalConfig
    this._saveToParameter = saveToParameter
  }

  importAnnotation() {
    new LoadDialog(
      'Load Annotations',
      this._dataAccessObject.annotationUrl,
      (url) => this._dataAccessObject.getAnnotationFromServer(url),
      ({ files }) => readAnnotationFile(files, this._editor),
      this._history.hasAnythingToSaveAnnotation
    ).open()
  }

  uploadAnnotation() {
    new SaveAnnotationDialog(
      this._editor,
      this._saveToParameter || this._dataAccessObject.annotationUrl,
      this._editedAnnotation
    ).open()
  }

  saveAnnotation() {
    this._dataAccessObject.saveAnnotation(
      this._editedAnnotation,
      this._saveToParameter
    )
  }

  importConfiguration() {
    new LoadDialog(
      'Load Configurations',
      this._dataAccessObject.configurationUrl,
      (url) => this._dataAccessObject.getConfigurationFromServer(url),
      ({ files }) => readConfigurationFile(files, this._editor),
      this._history.hasAnythingToSaveConfiguration
    ).open()
  }

  uploadConfiguration() {
    // Merge with the original config and save the value unchanged in the editor.
    const editidConfig = Object.assign(
      {},
      this._getOriginalConfig(),
      this._typeDefinition.config
    )

    new SaveConfigurationDialog(
      this._editor,
      this._dataAccessObject.configurationUrl,
      this._getOriginalConfig(),
      editidConfig
    ).open()
  }

  get _editedAnnotation() {
    return mergeAnnotation(
      this._getOriginalAnnotation(),
      this._annotationData,
      this._typeDefinition.config
    )
  }
}
