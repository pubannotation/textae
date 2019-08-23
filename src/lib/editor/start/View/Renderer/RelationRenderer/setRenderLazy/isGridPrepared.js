import getDomPositionCache from '../../../getDomPositionCache'

export default function(editor, annotationData, relationId) {
  if (!annotationData.relation.get(relationId)) {
    return false
  }

  const domPositionCache = getDomPositionCache(editor, annotationData.entity)
  const relation = annotationData.relation.get(relationId)

  return (
    domPositionCache.gridPositionCache.isGridPrepared(relation.subj) &&
    domPositionCache.gridPositionCache.isGridPrepared(relation.obj)
  )
}
