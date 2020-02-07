import ChangeTypeCommand from '../ChangeTypeCommand'

export default function(
  annotationData,
  modelType,
  typeName,
  editor,
  changedProperties
) {
  return annotationData[modelType].all
    .filter((model) => model.type.name === typeName)
    .map((model) => {
      return new ChangeTypeCommand(
        editor,
        annotationData,
        modelType,
        model.id,
        changedProperties.get('id') || typeName
      )
    })
}
