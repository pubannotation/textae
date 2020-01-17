import getRemoveAtributesByPredAndObjCommands from './getRemoveAtributesByPredAndObjCommands'
import getExistingSamePredicateAttributes from './getExistingSamePredicateAttributes'

export default function(
  editor,
  annotationData,
  selectionModel,
  attributeDefinition
) {
  const attrs = getExistingSamePredicateAttributes(
    selectionModel.entity.all,
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
