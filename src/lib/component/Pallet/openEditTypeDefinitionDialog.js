import EditTypeDefinitionDialog from './EditTypeDefinitionDialog'
import getDifference from './getDifference'

export default function(elementEditor, id, color, isDefault, autocompletionWs) {
  const handler = elementEditor.getHandler()
  const label = handler.typeContainer.getLabel(id) || ''
  const beforeChange = {
    id,
    label,
    color,
    isDefault
  }
  const done = (newId, newLabel, newColor, newDefault) => {
    const afterChange = {
      id: newId,
      label: newLabel,
      color: newColor,
      isDefault: newDefault
    }

    const changedProperties = getDifference(beforeChange, afterChange)
    if (changedProperties.size) {
      handler.commander.invoke(handler.changeType(id, changedProperties))
    }
  }
  const dialog = new EditTypeDefinitionDialog(
    handler.typeContainer,
    done,
    autocompletionWs,
    'Please edit the type'
  )
  dialog.update(id, label, color, isDefault)
  dialog.open()
}
