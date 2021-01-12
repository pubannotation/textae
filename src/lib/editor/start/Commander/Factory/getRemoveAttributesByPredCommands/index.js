import getRemoveAtributesByPredAndObjCommands from './getRemoveAtributesByPredAndObjCommands'
import getExistingSamePredicateAttributes from './getExistingSamePredicateAttributes'

export default function (
  editor,
  annotationData,
  selectionModel,
  attributeDefinition
) {
  const attrs = getExistingSamePredicateAttributes(
    selectionModel.entity.all,
    attributeDefinition
  )
  return getRemoveAtributesByPredAndObjCommands(
    attrs,
    editor,
    annotationData,
    selectionModel
  )
}
