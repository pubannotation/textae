import getAttributeValueClickedButton from '../getAttributeValueClickedButton'
import changeAttributeHandler from './changeAttribute'

export default function(editor, selectionModel, commander, e) {
  const selectedEntities = selectionModel.entity.all()
  const { pred, obj } = getAttributeValueClickedButton(e)
  changeAttributeHandler(editor, commander, selectedEntities, pred, obj)
}
