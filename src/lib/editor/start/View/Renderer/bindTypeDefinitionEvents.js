export default function (editor, entityRenderer, relationRenderer) {
  editor.eventEmitter
    .on('textae-event.typeDefinition.entity.type.change', (typeName) =>
      entityRenderer.updateEntityHtmlelement(typeName)
    )
    .on('textae-event.typeDefinition.attribute.change', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae-event.typeDefinition.attribute.move', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae-event.typeDefinition.relation.type.change', (typeName) =>
      relationRenderer.changeType(typeName)
    )
    .on('textae-event.typeDefinition.reset', () => {
      entityRenderer.updateEntityHtmlelementAll()
      relationRenderer.changeAll()
    })
}
