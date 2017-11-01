export default function(dataAccessObject, history, annotationData, typeContainer, getOriginalAnnotation, params) {
  const showAccess = () => dataAccessObject.showAccess(history.hasAnythingToSave(), params),
    showSave = () => {
      if (isAnnotationImported(params)) {
        showSaveDailogWithEditedData(dataAccessObject, annotationData, typeContainer, getOriginalAnnotation, params)
      } else {
        alert('please import an annotation from server or set by an inline configuration.')
      }
    }

  return {
    showAccess,
    showSave
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

function isAnnotationImported(params) {
  return params.has('inlineAnnotation') || params.has('url')
}
