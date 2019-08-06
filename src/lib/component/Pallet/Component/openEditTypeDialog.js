import EditTypeDialog from './EditTypeDialog'
import invokeChangeTypeCommand from './invokeChangeTypeCommand'

export default function(elementEditor, e, editor, autocompletionWs) {
  const target = e.delegateTarget
  const id = target.getAttribute('data-id')
  const handler = elementEditor.getHandler()
  const label = handler.typeContainer.getLabel(id) || ''
  const color = target.getAttribute('data-color').toLowerCase()
  const isDefault = target.getAttribute('data-is-default') === 'true'
  const oldType = {
    id,
    label,
    color,
    isDefault
  }
  const done = (newId, newLabel, newColor, newDefault) => {
    const newType = {
      id: newId,
      label: newLabel,
      color: newColor,
      isDefault: newDefault
    }
    invokeChangeTypeCommand(oldType, newType, handler)
  }
  const dialog = new EditTypeDialog(
    editor,
    handler.typeContainer,
    done,
    autocompletionWs,
    'Please edit the type'
  )
  dialog.update(id, label, color, isDefault)
  dialog.open()
}
