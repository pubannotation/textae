import { RemoveCommand } from './commandTemplate'

export default function (editor, annotationData, selectionModel, pred) {
  const items = selectionModel.entity.all

  return items
    .reduce((attrs, entity) => attrs.concat(entity.attributes), [])
    .filter((a) => a.pred === pred)
    .map(
      (a) =>
        new RemoveCommand(
          editor,
          annotationData,
          selectionModel,
          'attribute',
          a.id
        )
    )
}
