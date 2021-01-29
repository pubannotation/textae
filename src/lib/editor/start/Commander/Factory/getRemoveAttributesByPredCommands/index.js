import getRemoveAtributesByPredAndObjCommands from './getRemoveAtributesByPredAndObjCommands'

export default function (
  editor,
  annotationData,
  selectionModel,
  attributeDefinition
) {
  const attrs = selectionModel.entity.all
    .reduce((attrs, entity) => attrs.concat(entity.attributes), [])
    .filter((a) => a.pred === attributeDefinition.pred)

  return getRemoveAtributesByPredAndObjCommands(
    attrs,
    editor,
    annotationData,
    selectionModel
  )
}
