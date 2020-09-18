import getDomPositionCache from '../../../getDomPositionCache'

export default function(editor, annotationData, relationId) {
  if (!annotationData.relation.get(relationId)) {
    return false
  }

  const domPositionCache = getDomPositionCache(editor, annotationData.entity)
  const relation = annotationData.relation.get(relationId)

  return (
    domPositionCache.isGridPrepared(relation.subj) &&
    domPositionCache.isGridPrepared(relation.obj)
  )
}
