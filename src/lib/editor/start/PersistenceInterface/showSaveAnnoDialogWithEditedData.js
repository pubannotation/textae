export default function(
  dataAccessObject,
  annotationData,
  config,
  originalAnnotation,
  saveToParameter
) {
  // Merge with the original annotation and save the value unchanged in the editor.
  const editedAnnotation = Object.assign(
    originalAnnotation,
    annotationData.toJson(),
    { config }
  )

  dataAccessObject.showSaveAnno(editedAnnotation, saveToParameter)
}
