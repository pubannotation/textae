export default function(entities, annotationData, newAttributes) {
  return entities.reduce(
    (attributes, entity) =>
      attributes.concat(
        // Exclude attributes that don't change.
        annotationData.entity.get(entity).getDifferentAttributes(newAttributes)
      ),
    []
  )
}
