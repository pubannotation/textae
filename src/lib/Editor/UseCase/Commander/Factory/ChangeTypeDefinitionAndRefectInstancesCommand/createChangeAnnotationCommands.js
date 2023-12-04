import ChangeAnnotationCommand from '../ChangeAnnotationCommand'

export default function (
  annotationModel,
  annotationType,
  oldTypeName,
  newTypeName
) {
  return annotationModel[annotationType].all
    .filter((instance) => instance.typeName === oldTypeName)
    .map((instance) => {
      return new ChangeAnnotationCommand(
        annotationModel,
        annotationType,
        instance.id,
        newTypeName
      )
    })
}
