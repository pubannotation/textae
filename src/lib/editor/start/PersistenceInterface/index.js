import showSaveConfDialogWithEditedData from './showSaveConfDialogWithEditedData'
import mergeAnnotation from './mergeAnnotation'

export default class {
  constructor(
    dataAccessObject,
    history,
    annotationData,
    typeDefinition,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter
  ) {
    this._dataAccessObject = dataAccessObject
    this._history = history
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._getOriginalAnnotation = getOriginalAnnotation
    this._getOriginalConfig = getOriginalConfig
    this._saveToParameter = saveToParameter
  }

  importAnnotation() {
    this._dataAccessObject.showAccessAnnotation(
      this._history.hasAnythingToSaveAnnotation
    )
  }

  uploadAnnotation() {
    this._dataAccessObject.showSaveAnnotation(
      this._editedAnnotation,
      this._saveToParameter
    )
  }

  importConfiguration() {
    this._dataAccessObject.showAccessConfiguration(
      this._history.hasAnythingToSaveConfiguration
    )
  }

  uploadConfiguration() {
    showSaveConfDialogWithEditedData(
      this._dataAccessObject,
      this._typeDefinition.config,
      this._getOriginalConfig()
    )
  }

  get _editedAnnotation() {
    return mergeAnnotation(
      this._getOriginalAnnotation(),
      this._annotationData,
      this._typeDefinition.config
    )
  }
}
