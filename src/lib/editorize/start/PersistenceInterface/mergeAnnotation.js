// Merge with the original annotation and save the value unchanged in the editor.
export default function (originalAnnotation, annotationData, config) {
  return Object.assign(originalAnnotation, annotationData.JSON, { config })
}
