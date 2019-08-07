import ChangeTypeCommand from '../ChangeTypeCommand'

export default function(
  annotationData,
  modelType,
  id,
  editor,
  changedProperties
) {
  return annotationData[modelType]
    .all()
    .filter((model) => model.type === id)
    .map((model) => {
      return new ChangeTypeCommand(
        editor,
        annotationData,
        modelType,
        model.id,
        changedProperties.get('id') || id
      )
    })
}
