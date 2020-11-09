import ChangeTypeCommand from '../ChangeTypeCommand'

export default function (
  annotationData,
  modelType,
  oldTypeName,
  editor,
  newTypeName
) {
  return annotationData[modelType].all
    .filter((model) => model.typeName === oldTypeName)
    .map((model) => {
      return new ChangeTypeCommand(
        editor,
        annotationData,
        modelType,
        model.id,
        newTypeName
      )
    })
}
