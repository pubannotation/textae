import typeValeusClicked from './typeValuesClicked'
import entityClicked from './entityClicked'

export default function(editor, spanEditor, selectionModel) {
  editor.eventEmitter
    .on('textae.editor.editEntity.textBox.click', (e) =>
      spanEditor.textBoxClicked(e)
    )
    .on('textae.editor.editEntity.span.mouseup', (e) =>
      spanEditor.spanClicked(e)
    )
    .on('textae.editor.editEntity.entity.click', (e) =>
      entityClicked(selectionModel, e)
    )
    .on('textae.editor.editEntity.type.click', () => editor.focus())
    .on('textae.editor.editEntity.typeValues.click', (e) =>
      typeValeusClicked(selectionModel, e)
    )
}
