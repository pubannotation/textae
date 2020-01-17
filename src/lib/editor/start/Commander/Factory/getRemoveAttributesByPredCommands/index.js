import getRemoveAtributesByPredAndObjCommands from './getRemoveAtributesByPredAndObjCommands'
import getExistingSamePredicateAttributes from './getExistingSamePredicateAttributes'

export default function(
  editor,
  annotationData,
  selectionModel,
  attributeDefinition
) {
  const entities = selectionModel.entity.all
  const attrs = getExistingSamePredicateAttributes(
    entities,
    annotationData,
    attributeDefinition
  )
  const removeAttributeCommands = getRemoveAtributesByPredAndObjCommands(
    attrs,
    editor,
    annotationData,
    selectionModel
  )
  return removeAttributeCommands
}
