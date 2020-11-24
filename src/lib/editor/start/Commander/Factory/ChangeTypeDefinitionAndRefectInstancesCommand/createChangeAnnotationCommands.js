import ChangeTypeCommand from '../ChangeTypeCommand'

export default function (
  annotationData,
  annotationType,
  oldTypeName,
  editor,
  newTypeName
) {
  return annotationData[annotationType].all
    .filter((model) => model.typeName === oldTypeName)
    .map((model) => {
      return new ChangeTypeCommand(
        editor,
        annotationData,
        annotationType,
        model.id,
        newTypeName
      )
    })
}
