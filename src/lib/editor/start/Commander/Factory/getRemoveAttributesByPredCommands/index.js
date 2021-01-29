import { RemoveCommand } from '../commandTemplate'

export default function (
  editor,
  annotationData,
  selectionModel,
  attributeDefinition
) {
  return selectionModel.entity.all
    .reduce((attrs, entity) => attrs.concat(entity.attributes), [])
    .filter((a) => a.pred === attributeDefinition.pred)
    .map((attribute) => {
      return new RemoveCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        attribute.id
      )
    })
}
