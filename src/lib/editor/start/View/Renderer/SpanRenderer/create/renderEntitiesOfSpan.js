export default function(span, annotationData, renderEntityFunc) {
  span
    .getTypes()
    .forEach((type) =>
      renderEntitiesOfType(type, annotationData, renderEntityFunc)
    )
}

function renderEntitiesOfType(type, annotationData, renderEntityFunc) {
  type.entities.forEach(renderEntityFunc)
}
