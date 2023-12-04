import ChangeAnnotationCommand from '../ChangeAnnotationCommand'

export default function (
  annotationData,
  annotationType,
  oldTypeName,
  newTypeName
) {
  return annotationData[annotationType].all
    .filter((instance) => instance.typeName === oldTypeName)
    .map((instance) => {
      return new ChangeAnnotationCommand(
        annotationData,
        annotationType,
        instance.id,
        newTypeName
      )
    })
}
