export default function(annotationData, relationRenderer) {
  relationRenderer.reset()
  annotationData.relation.all.forEach((relatiton) =>
    relationRenderer.render(relatiton)
  )
}
