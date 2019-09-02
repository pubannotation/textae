import getAttributeValueByClickedButton from './getAttributeValueClickedButton'

export default function(selectionModel, commander, e) {
  const selectedEntities = selectionModel.entity.all()
  const { pred, obj } = getAttributeValueByClickedButton(e)
  const commands = commander.factory.attributeRemoveCommand(
    selectedEntities,
    pred,
    obj
  )
  commander.invoke(commands)

  // The event target DOM element of the attribute has already been deleted.
  // It can not be determined whether this click event occurred in the editor.
  e.stopPropagation()
}
