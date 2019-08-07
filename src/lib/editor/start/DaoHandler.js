export default function(
  dataAccessObject,
  history,
  annotationData,
  typeDefinition,
  getOriginalAnnotation,
  params
) {
  const showAccess = () =>
    dataAccessObject.showAccess(history.hasAnythingToSaveAnnotation)
  const showSave = () =>
    showSaveDialogWithEditedData(
      dataAccessObject,
      annotationData,
      typeDefinition,
      getOriginalAnnotation,
      params
    )
  const showAccessConf = () =>
    dataAccessObject.showAccessConf(history.hasAnythingToSaveConfiguration)
  const showSaveConf = () =>
    showSaveConfDialogWithEditedData(
      dataAccessObject,
      annotationData,
      typeDefinition,
      getOriginalAnnotation,
      params
    )

  return {
    showAccess,
    showSave,
    showAccessConf,
    showSaveConf
  }
}

function showSaveDialogWithEditedData(
  dataAccessObject,
  annotationData,
  typeDefinition,
  getOriginalAnnotation,
  params
) {
  const originalData = getOriginalAnnotation()
  const config = typeDefinition.getConfig()

  dataAccessObject.showSave(
    Object.assign(
      JSON.parse(JSON.stringify(originalData)),
      annotationData.toJson(),
      { config }
    ),
    params
  )
}

function showSaveConfDialogWithEditedData(
  dataAccessObject,
  annotationData,
  typeDefinition,
  getOriginalAnnotation,
  params
) {
  const originalData = getOriginalAnnotation()
  const config = typeDefinition.getConfig()

  dataAccessObject.showSaveConf(
    originalData,
    Object.assign(
      JSON.parse(JSON.stringify(originalData)),
      annotationData.toJson(),
      { config }
    ),
    params
  )
}
