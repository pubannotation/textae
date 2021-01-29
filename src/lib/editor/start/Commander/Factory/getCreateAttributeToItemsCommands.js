import { CreateCommand } from './commandTemplate'
import EntityModel from '../../../EntityModel'

export default function (
  annotationData,
  editor,
  selectionModel,
  items,
  pred,
  obj
) {
  return EntityModel.filterWithoutSamePredicateAttribute(items, pred).map(
    (entity) => {
      return new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        false,
        {
          id: null,
          subj: entity.id,
          pred,
          obj
        }
      )
    }
  )
}
