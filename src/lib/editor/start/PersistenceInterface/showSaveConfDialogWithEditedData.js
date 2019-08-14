export default function showSaveConfDialogWithEditedData(
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
