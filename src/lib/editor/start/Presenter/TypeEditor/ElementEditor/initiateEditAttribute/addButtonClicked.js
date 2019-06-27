export default function(editor, selectionModel, e) {
  const entityId = e.target.parentNode.querySelector('.textae-editor__entity').getAttribute('title')
  selectionModel.clear()
  selectionModel.entity.add(entityId)
  editor.api.handlePopupClick('textae.popup.button.add_attribute.click', null)
}
