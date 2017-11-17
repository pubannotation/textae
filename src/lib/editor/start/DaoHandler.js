export default function(dataAccessObject, history, annotationData, typeContainer, getOriginalAnnotation, params) {
  const showAccess = () => dataAccessObject.showAccess(history.hasAnythingToSave(), params),
    showSave = () => showSaveDailogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params)

  return {
    showAccess, showSave
  }
}

function showSaveDailogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params) {
  const originalData = getOriginalAnnotation(),
    config = typeContainer.getConfig()

  dataAccessObject.showSave(
    originalData,
    Object.assign(JSON.parse(JSON.stringify(originalData)), annotationData.toJson(), {config}),
    params
  )
}
