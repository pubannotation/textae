import { CreateCommand } from './commandTemplate'

export default function (annotationModel, items, pred, obj) {
  return items
    .filter((i) => !i.typeValues.hasSpecificPredicateAttribute(pred))
    .map(({ id }) => {
      return new CreateCommand(annotationModel, 'attribute', {
        id: null,
        subj: id,
        pred,
        obj
      })
    })
}
