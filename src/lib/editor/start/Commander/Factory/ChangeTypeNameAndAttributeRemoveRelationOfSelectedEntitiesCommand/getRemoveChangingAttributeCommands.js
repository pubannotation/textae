import { RemoveCommand } from '../commandTemplate'
import getChangingAttributesFromEntitiers from './getChangingAttributesFromEntitiers'

export default function(
  entitiesWithChange,
  annotationData,
  newAttributes,
  editor,
  selectionModel
) {
  return getChangingAttributesFromEntitiers(
    entitiesWithChange,
    annotationData,
    newAttributes
  ).map(
    (attribute) =>
      new RemoveCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        attribute.id
      )
  )
}
