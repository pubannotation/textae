export default function (annotationData, relationId) {
  if (!annotationData.relation.get(relationId)) {
    return false
  }

  const relation = annotationData.relation.get(relationId)

  return (
    annotationData.entity.get(relation.subj).span.isGridRendered &&
    annotationData.entity.get(relation.obj).span.isGridRendered
  )
}
