import { RemoveCommand } from './commandTemplate'

export default function (editor, annotationData, selectionModel, pred) {
  return selectionModel.entity.all
    .reduce((attrs, entity) => attrs.concat(entity.attributes), [])
    .filter((a) => a.pred === pred)
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
