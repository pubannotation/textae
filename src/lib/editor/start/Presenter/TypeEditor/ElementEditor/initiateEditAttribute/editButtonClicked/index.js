import getAttributeValueClickedButton from '../getAttributeValueClickedButton'
import changeAttributeHandler from './changeAttribute'

export default function(selectionModel, commander, e) {
  const selectedEntities = selectionModel.entity.all()
  const { pred, obj } = getAttributeValueClickedButton(e)
  changeAttributeHandler(commander, selectedEntities, pred, obj)
}
