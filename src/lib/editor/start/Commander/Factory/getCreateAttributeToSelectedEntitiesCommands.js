import { CreateCommand } from './commandTemplate'
import EntityModel from '../../../EntityModel'

export default function (annotationData, editor, selectionModel, pred, obj) {
  return EntityModel.filterWithoutSamePredicateAttribute(
    selectionModel.entity.all,
    pred
  ).map((entity) => {
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
  })
}
