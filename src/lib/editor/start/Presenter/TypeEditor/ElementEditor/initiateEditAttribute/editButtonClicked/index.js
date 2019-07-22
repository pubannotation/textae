import getAttributeValueClickedButton from '../getAttributeValueClickedButton'
import changeAttributeHandler from './changeAttribute'

export default function(editor, selectionModel, command, e) {
  const selectedEntities = selectionModel.entity.all()
  const {pred, obj} = getAttributeValueClickedButton(e)
  changeAttributeHandler(editor, command, selectedEntities, pred, obj)
}
