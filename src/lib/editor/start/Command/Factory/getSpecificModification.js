import isModificationType from './isModificationType'
export default function getSpecificModification(
  annotationData,
  id,
  modificationType
) {
  return annotationData
    .getModificationOf(id)
    .filter((modification) =>
      isModificationType(modification, modificationType)
    )
}
