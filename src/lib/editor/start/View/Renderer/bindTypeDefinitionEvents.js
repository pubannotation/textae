export default function (editor, entityRenderer, relationRenderer) {
  editor.eventEmitter
    .on('textae-event.type-definition.entity.type.change', (typeName) =>
      entityRenderer.updateEntityHtmlelement(typeName)
    )
    .on('textae-event.type-definition.attribute.change', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae-event.type-definition.attribute.move', (pred) =>
      entityRenderer.updateAttribute(pred)
    )
    .on('textae-event.type-definition.relation.type.change', (typeName) =>
      relationRenderer.changeType(typeName)
    )
}
