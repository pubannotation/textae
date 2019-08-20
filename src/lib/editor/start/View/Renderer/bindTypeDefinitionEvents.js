export default function(typeDefinition, entityRenderer, relationRenderer) {
  typeDefinition.entity
    .on('type.change', (id) => entityRenderer.updateLabel(id))
    .on('type.reset', () => entityRenderer.updateLabelAll())
  typeDefinition.relation.on('type.reset', () => relationRenderer.changeAll())
}
