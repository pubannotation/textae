export default function(editor, entityRenderer, relationRenderer) {
  editor.eventEmitter
    .on('textae.typeDefinition.entity.type.change', () => {
      // If you update a type that includes a wildcard, update the label other than the target type.
      entityRenderer.updateLabelAll()
    })
    .on('textae.typeDefinition.entity.type.reset', () =>
      entityRenderer.updateLabelAll()
    )

  editor.eventEmitter.on('textae.typeDefinition.relation.type.reset', () =>
    relationRenderer.changeAll()
  )
}
