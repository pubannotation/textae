export default function showSaveDialogWithEditedData(
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
