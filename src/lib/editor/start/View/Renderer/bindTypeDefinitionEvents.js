export default function(editor, entityRenderer, relationRenderer) {
  editor.eventEmitter
    .on('textae.typeDefinition.entity.type.change', (typeName) => {
      // If you update a type that includes a wildcard, update the label other than the target type.
      entityRenderer.updateTypeDom(typeName)
    })
    .on('textae.typeDefinition.entity.type.reset', () =>
      entityRenderer.updateTypeDomAll()
    )

  editor.eventEmitter.on('textae.typeDefinition.relation.type.reset', () =>
    relationRenderer.changeAll()
  )
}
