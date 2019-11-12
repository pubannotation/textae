import getRemoveAtributesCommands from './getRemoveAtributesByPredAndObjCommands'
import getExistingSamePredicateAttributes from './ToggleFlagAttributeToSelectedEntitiesCommand/getExistingSamePredicateAttributes'

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
  const removeAttributeCommands = getRemoveAtributesCommands(
    attrs,
    editor,
    annotationData,
    selectionModel
  )
  return removeAttributeCommands
}
