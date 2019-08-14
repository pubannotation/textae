import showSaveDialogWithEditedData from './showSaveDialogWithEditedData'
import showSaveConfDialogWithEditedData from './showSaveConfDialogWithEditedData'

export default class {
  constructor(
    dataAccessObject,
    history,
    annotationData,
    typeDefinition,
    getOriginalAnnotation,
    params
  ) {
    this._dataAccessObject = dataAccessObject
    this._history = history
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._getOriginalAnnotation = getOriginalAnnotation
    this._params = params
  }

  importAnnotation() {
    this._dataAccessObject.showAccess(this._history.hasAnythingToSaveAnnotation)
  }

  uploadAnnotation() {
    showSaveDialogWithEditedData(
      this._dataAccessObject,
      this._annotationData,
      this._typeDefinition,
      this._getOriginalAnnotation,
      this._params
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
      this._annotationData,
      this._typeDefinition,
      this._getOriginalAnnotation,
      this._params
    )
  }
}
