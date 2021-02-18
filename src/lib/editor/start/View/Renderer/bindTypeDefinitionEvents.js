export default function (editor, entityRenderer, relationRenderer) {
  editor.eventEmitter
    .on('textae-event.type-definition.entity.change', (typeName) =>
      entityRenderer.updateEntityHtmlelement(typeName)
    )
    .on('textae-event.type-definition.attribute.change', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae-event.type-definition.attribute.move', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae-event.type-definition.relation.change', (typeName) =>
      relationRenderer.changeType(typeName)
    )
}
