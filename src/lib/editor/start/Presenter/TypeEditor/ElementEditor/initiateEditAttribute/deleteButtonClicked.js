import getAttributeValueByClickedButton from './getAttributeValueClickedButton'

export default function(selectionModel, command, e) {
  const selectedEntities = selectionModel.entity.all()
  const { pred, obj } = getAttributeValueByClickedButton(e)
  const commands = command.factory.attributeRemoveCommand(
    selectedEntities,
    pred,
    obj
  )
  command.invoke([commands])

  // The event target DOM element of the attribute has already been deleted.
  // It can not be determined whether this click event occurred in the editor.
  e.stopPropagation()
}
