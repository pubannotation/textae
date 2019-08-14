import showSaveAnnoDialogWithEditedData from './showSaveAnnoDialogWithEditedData'
import showSaveConfDialogWithEditedData from './showSaveConfDialogWithEditedData'

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
    this._dataAccessObject.showAccessAnno(
      this._history.hasAnythingToSaveAnnotation
    )
  }

  uploadAnnotation() {
    showSaveAnnoDialogWithEditedData(
      this._dataAccessObject,
      this._annotationData,
      this._typeDefinition,
      this._getOriginalAnnotation,
      this._saveToParameter
    )
  }

  importConfiguration() {
    this._dataAccessObject.showAccessConf(
      this._history.hasAnythingToSaveConfiguration
    )
  }

  uploadConfiguration() {
    showSaveConfDialogWithEditedData(
      this._dataAccessObject,
      this._typeDefinition,
      this._getOriginalConfig
    )
  }
}
