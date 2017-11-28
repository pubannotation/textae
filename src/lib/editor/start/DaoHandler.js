export default function(dataAccessObject, history, annotationData, typeContainer, getOriginalAnnotation, params) {
  const showAccess = () => dataAccessObject.showAccess(history.hasAnythingToSave(), params),
    showSave = () => showSaveDialogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params),
    showAccessConf = () => dataAccessObject.showAccessConf(history.hasAnythingToSave(), params),
    showSaveConf = () => showSaveConfDialogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params)

  return {
    showAccess,
    showSave,
    showAccessConf,
    showSaveConf,
  }
}

function showSaveDialogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params) {
  const originalData = getOriginalAnnotation(),
    config = typeContainer.getConfig()

  dataAccessObject.showSave(
    originalData,
    Object.assign(JSON.parse(JSON.stringify(originalData)), annotationData.toJson(), {config}),
    params
  )
}

function showSaveConfDialogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params) {
  const originalData = getOriginalAnnotation(),
    config = typeContainer.getConfig()

  dataAccessObject.showSaveConf(
    originalData,
    Object.assign(JSON.parse(JSON.stringify(originalData)), annotationData.toJson(), {config}),
    params
  )
}
