import { CreateCommand } from './commandTemplate'

export default function (editor, annotationData, items, pred, obj) {
  return items
    .filter((i) => !i.typeValues.hasSpecificPredicateAttribute(pred))
    .map(({ id }) => {
      return new CreateCommand(editor, annotationData, 'attribute', {
        id: null,
        subj: id,
        pred,
        obj
      })
    })
}
