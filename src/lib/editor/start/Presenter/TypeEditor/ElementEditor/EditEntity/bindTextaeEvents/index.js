import selectEntity from './selectEntity'
import getEntityDomFromChild from '../../../../../getEntityDomFromChild'

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
    .on('textae.editor.editEntity.endpoint.click', (e) =>
      selectEntity(
        e.ctrlKey || e.metaKey,
        selectionModel,
        getEntityDomFromChild(e.target)
      )
    )
    .on('textae.editor.editEntity.entity.click', () => editor.focus())
    .on('textae.editor.editEntity.typeValues.click', (e) => {
      const entity = getEntityDomFromChild(e.target)
      selectEntity(e.ctrlKey || e.metaKey, selectionModel, entity)
    })
}
