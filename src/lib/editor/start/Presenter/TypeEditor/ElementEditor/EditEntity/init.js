import spanClicked from './spanClicked'
import bodyClicked from './bodyClicked'
import typeLabelClicked from './typeLabelClicked'
import entityClicked from './entityClicked'
import entityPaneClicked from './entityPaneClicked'
import deleteButtonClicked from './deleteButtonClicked'
import getAttributeIdByClickedButton from './getAttributeIdByClickedButton'

export default function(editor, cancelSelect, selectEnd, spanConfig, selectSpan, selectionModel, annotationData, command) {
  editor
    .on('mouseup', '.textae-editor__body', () => bodyClicked(cancelSelect, selectEnd, spanConfig))
    .on('mouseup', '.textae-editor__type', () => editor.focus())
    .on('mouseup', '.textae-editor__span', (e) => spanClicked(spanConfig, selectEnd, selectSpan, e))
    .on('mouseup', '.textae-editor__type-label', (e) => typeLabelClicked(selectionModel, e))
    .on('mouseup', '.textae-editor__entity-pane', (e) => entityPaneClicked(selectionModel, e))
    .on('mouseup', '.textae-editor__entity', (e) => entityClicked(selectionModel, e))
    .on('click', '.textae-editor__attribute-button--add', (e) => addButtonClicked(editor, selectionModel, e))
    .on('click', '.textae-editor__attribute-button--edit', (e) => editButtonClicked(editor, selectionModel, e))
    .on('click', '.textae-editor__attribute-button--delete', (e) => deleteButtonClicked(annotationData, selectionModel, command, e))
}

function addButtonClicked(editor, selectionModel, e) {
  const entityId = e.target.parentNode.querySelector('.textae-editor__entity').getAttribute('title')
  selectionModel.clear()
  selectionModel.entity.add(entityId)
  editor.api.handlePopupClick('textae.popup.button.add_attribute.click', null)
}

function editButtonClicked(editor, selectionModel, e) {
  const attributeId = getAttributeIdByClickedButton(e)
  selectionModel.clear()
  selectionModel.attribute.add(attributeId)
  editor.api.handlePopupClick('textae.popup.button.change_label.click', null)
}
