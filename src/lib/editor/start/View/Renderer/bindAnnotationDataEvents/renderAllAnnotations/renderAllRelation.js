export default function(annotationData, relationRenderer) {
  relationRenderer.reset()
  for (const relation of annotationData.relation.all) {
    relationRenderer.render(relation)
  }
}
