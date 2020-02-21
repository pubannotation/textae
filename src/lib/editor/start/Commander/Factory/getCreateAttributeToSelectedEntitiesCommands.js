import { CreateCommand } from './commandTemplate'

export default function(
  annotationData,
  attributeDefinition,
  editor,
  selectionModel,
  obj
) {
  return selectionModel.entity.all
    .filter((entity) =>
      // An entity cannot have more than one attribute with the same predicate.
      entity.type.withoutSamePredicateAttribute(attributeDefinition.pred)
    )
    .map((entity) => {
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
