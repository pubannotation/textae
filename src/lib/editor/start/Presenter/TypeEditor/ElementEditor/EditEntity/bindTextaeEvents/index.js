import getSelectionSnapShot from './getSelectionSnapShot'
import typeValeusClicked from './typeValuesClicked'
import entityClicked from './entityClicked'
import spanClicked from './spanClicked'

export default function(editor, spanEditor, annotationData, selectionModel) {
  editor.eventEmitter
    .on('textae.editor.editEntity.textBox.click', (e) => {
      const selection = window.getSelection()
      // if text is seleceted
      if (selection.type === 'Range') {
        spanEditor.selectEndOnText(getSelectionSnapShot())
        e.stopPropagation()
      }
    })
    .on('textae.editor.editEntity.span.mouseup', (e) =>
      spanClicked(e, annotationData, selectionModel, () =>
        spanEditor.selectEndOnSpan(getSelectionSnapShot())
      )
    )
    .on('textae.editor.editEntity.entity.click', (e) =>
      entityClicked(selectionModel, e)
    )
    .on('textae.editor.editEntity.type.click', () => editor.focus())
    .on('textae.editor.editEntity.typeValues.click', (e) =>
      typeValeusClicked(selectionModel, e)
    )
}
