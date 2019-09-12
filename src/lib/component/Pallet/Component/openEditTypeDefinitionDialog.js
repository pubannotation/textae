import EditTypeDefinitionDialog from './EditTypeDefinitionDialog'
import getDifference from './getDifference'

export default function(elementEditor, e, autocompletionWs) {
  const target = e.delegateTarget
  const id = target.getAttribute('data-id')
  const handler = elementEditor.getHandler()
  const label = handler.typeContainer.getLabel(id) || ''
  const color = target.getAttribute('data-color').toLowerCase()
  const isDefault = target.getAttribute('data-is-default') === 'true'
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
