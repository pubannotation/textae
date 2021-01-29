import { CreateCommand } from './commandTemplate'

export default function (
  editor,
  annotationData,
  selectionModel,
  items,
  pred,
  obj
) {
  return items
    .filter((i) => !i.hasSpecificPredicateAttribute(pred))
    .map(({ id }) => {
      return new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        false,
        {
          id: null,
          subj: id,
          pred,
          obj
        }
      )
    })
}
