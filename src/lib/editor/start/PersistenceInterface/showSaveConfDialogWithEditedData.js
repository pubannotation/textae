export default function showSaveConfDialogWithEditedData(
  dataAccessObject,
  annotationData,
  typeDefinition,
  getOriginalAnnotation
) {
  const originalData = getOriginalAnnotation()
  const config = typeDefinition.getConfig()

  dataAccessObject.showSaveConf(
    originalData.config,
    Object.assign(
      JSON.parse(JSON.stringify(originalData)),
      annotationData.toJson(),
      { config }
    ).config
  )
}
