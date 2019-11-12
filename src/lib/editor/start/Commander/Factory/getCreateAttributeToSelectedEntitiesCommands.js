import { CreateCommand } from './commandTemplate'

export default function(
  entities,
  annotationData,
  attributeDefinition,
  editor,
  selectionModel
) {
  return entities
    .filter((entityId) =>
      // An entity cannot have more than one attribute with the same predicate.
      annotationData.entity
        .get(entityId)
        .type.withoutSamePredicateAttribute(attributeDefinition.pred)
    )
    .map((subj) => {
      return new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        false,
        {
          id: null,
          subj,
          pred: attributeDefinition.pred,
          obj: attributeDefinition.default
        }
      )
    })
}
