import selectEntity from './selectEntity'
import getTypeDomOfEntityDom from '../../../../../getTypeDomOfEntityDom'

export default function(editor, spanEditor, selectionModel) {
  editor.eventEmitter
    .on('textae.editor.editEntity.textBox.click', (e) =>
      spanEditor.textBoxClicked(e)
    )
    .on('textae.editor.editEntity.span.mouseup', (e) =>
      spanEditor.spanClicked(e)
    )
    .on('textae.editor.editEntity.style.mouseup', (e) =>
      spanEditor.styleSpanClicked(e)
    )
    .on('textae.editor.editEntity.entity.click', (e) =>
      selectEntity(e.ctrlKey || e.metaKey, selectionModel, e.target)
    )
    .on('textae.editor.editEntity.type.click', () => editor.focus())
    .on('textae.editor.editEntity.typeValues.click', (e) => {
      const entity = getTypeDomOfEntityDom(e.target).querySelector(
        '.textae-editor__entity'
      )
      selectEntity(e.ctrlKey || e.metaKey, selectionModel, entity)
    })
}
