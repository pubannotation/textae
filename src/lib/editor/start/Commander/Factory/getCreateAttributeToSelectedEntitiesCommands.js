import { CreateCommand } from './commandTemplate'
import EntityModel from '../../../EntityModel'

export default function (
  annotationData,
  attributeDefinition,
  editor,
  selectionModel,
  obj
) {
  return EntityModel.filterWithoutSamePredicateAttribute(
    selectionModel.entity.all,
    attributeDefinition.pred
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
        pred: attributeDefinition.pred,
        obj: obj || attributeDefinition.default
      }
    )
  })
}
