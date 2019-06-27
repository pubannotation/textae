import getAttributeIdByClickedButton from './getAttributeIdByClickedButton'

export default function(editor, selectionModel, e) {
  const attributeId = getAttributeIdByClickedButton(e)
  selectionModel.clear()
  selectionModel.attribute.add(attributeId)
  editor.api.handlePopupClick('textae.popup.button.change_label.click', null)
}
