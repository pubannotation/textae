export default function(
  dataAccessObject,
  annotationData,
  typeDefinition,
  getOriginalAnnotation,
  saveToParameter
) {
  const originalAnnotation = getOriginalAnnotation()
  const config = typeDefinition.getConfig()

  // Merge with the original annotation and save the value unchanged in the editor.
  const editedAnnotation = Object.assign(
    originalAnnotation,
    annotationData.toJson(),
    { config }
  )

  dataAccessObject.showSaveAnno(editedAnnotation, saveToParameter)
}
