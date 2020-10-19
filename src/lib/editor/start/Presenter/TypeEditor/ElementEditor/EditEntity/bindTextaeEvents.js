export default function(editor, mouseEventHandler) {
  editor.eventEmitter
    .on('textae.editor.editEntity.textBox.click', (e) =>
      mouseEventHandler.textBoxClicked(e)
    )
    .on('textae.editor.editEntity.span.mouseup', (e) =>
      mouseEventHandler.spanClicked(e)
    )
    .on('textae.editor.editEntity.style.mouseup', (e) =>
      mouseEventHandler.styleSpanClicked(e)
    )
    .on('textae.editor.editEntity.endpoint.click', (e) =>
      mouseEventHandler.endpointClicked(e)
    )
    .on('textae.editor.editEntity.entity.click', () =>
      mouseEventHandler.entityClicked()
    )
    .on('textae.editor.editEntity.typeValues.click', (e) =>
      mouseEventHandler.typeValuesClicked(e)
    )
}
