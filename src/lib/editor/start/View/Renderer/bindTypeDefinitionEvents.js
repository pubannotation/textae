export default function(editor, entityRenderer, relationRenderer) {
  editor.eventEmitter
    .on('textae.typeDefinition.entity.type.change', (typeName) =>
      entityRenderer.updateTypeDom(typeName)
    )
    .on('textae.typeDefinition.entity.attributeDefinition.change', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae.typeDefinition.relation.type.change', (typeName) =>
      relationRenderer.changeType(typeName)
    )
    .on('textae.typeDefinition.reset', () => {
      entityRenderer.updateTypeDomAll()
      relationRenderer.changeAll()
    })
}
