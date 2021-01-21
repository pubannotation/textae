export default function (editor, entityRenderer, relationRenderer) {
  editor.eventEmitter
    .on('textae.typeDefinition.entity.type.change', (typeName) =>
      entityRenderer.updateEntityHtmlelement(typeName)
    )
    .on('textae.typeDefinition.attribute.change', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae.typeDefinition.attribute.move', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae.typeDefinition.relation.type.change', (typeName) =>
      relationRenderer.changeType(typeName)
    )
    .on('textae.typeDefinition.reset', () => {
      entityRenderer.updateEntityHtmlelementAll()
      relationRenderer.changeAll()
    })
}
