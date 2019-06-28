import getAttributeIdByClickedButton from '../getAttributeIdByClickedButton'
import changeAttributeHandler from './changeAttribute'

export default function(editor, annotationData, command, selectionModel, e) {
  const attributeId = getAttributeIdByClickedButton(e)
  selectionModel.clear()
  selectionModel.attribute.add(attributeId)
  changeAttributeHandler(editor, annotationData, command, attributeId)
}
