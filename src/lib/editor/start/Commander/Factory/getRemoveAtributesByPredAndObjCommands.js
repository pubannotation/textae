import { RemoveCommand } from './commandTemplate'

export default function(attrs, editor, annotationData, selectionModel) {
  return attrs.map((attribute) => {
    return new RemoveCommand(
      editor,
      annotationData,
      selectionModel,
      'attribute',
      attribute.id
    )
  })
}
