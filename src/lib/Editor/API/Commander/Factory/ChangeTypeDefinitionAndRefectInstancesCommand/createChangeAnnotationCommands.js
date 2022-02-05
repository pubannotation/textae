import ChangeAnnotationCommand from '../ChangeAnnotationCommand'

export default function (
  annotationData,
  annotationType,
  oldTypeName,
  newTypeName
) {
  return annotationData[annotationType].all
    .filter((model) => model.typeName === oldTypeName)
    .map((model) => {
      return new ChangeAnnotationCommand(
        annotationData,
        annotationType,
        model.id,
        newTypeName
      )
    })
}
