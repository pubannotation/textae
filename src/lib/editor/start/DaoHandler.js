export default function(dataAccessObject, history, annotationData, typeContainer, getOriginalAnnotation, params) {
  const showAccess = () => dataAccessObject.showAccess(history.hasAnythingToSave(), params),
    showSave = () => showSaveDailogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params)

  return {
    showAccess, showSave
  }
}

function showSaveDailogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params) {
  const originalAnnotation = getOriginalAnnotation(),
    config = typeContainer.getConfig()

  dataAccessObject.showSave(JSON.stringify(Object.assign(
    originalAnnotation,
    annotationData.toJson(), {
      config
    })), params)
}
