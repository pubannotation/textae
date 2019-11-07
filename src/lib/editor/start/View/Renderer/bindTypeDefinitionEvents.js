export default function(typeDefinition, entityRenderer, relationRenderer) {
  typeDefinition.entity
    .on('type.change', () => {
      // If you update a type that includes a wildcard, update the label other than the target type.
      entityRenderer.updateLabelAll()
    })
    .on('type.reset', () => entityRenderer.updateLabelAll())

  typeDefinition.relation.on('type.reset', () => relationRenderer.changeAll())
}
