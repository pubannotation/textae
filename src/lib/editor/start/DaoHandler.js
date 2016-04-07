export default function(dataAccessObject, history, annotationData, typeContainer, getOriginalAnnotation) {
  const showAccess = () => dataAccessObject.showAccess(history.hasAnythingToSave()),
    showSave = () => showSaveDailogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation)

  return {
    showAccess, showSave
  }
}

function showSaveDailogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation) {
  const originalAnnotation = getOriginalAnnotation(),
    config = typeContainer.getConfig()

  dataAccessObject.showSave(JSON.stringify(Object.assign(
    originalAnnotation,
    annotationData.toJson(), {
      config
    })), null, 2)
}
