import EditTypeDialog from './EditTypeDialog'

export default function(elementEditor, editor, autocompletionWs) {
  const handler = elementEditor.getHandler()

  const done = (newId, newLabel, newColor, newDefault) => {
    if (newId === '') {
      return
    }

    const newType = {
      id: newId,
      color: newColor
    }

    if (newLabel !== '') {
      newType.label = newLabel
    }

    if (newDefault) {
      newType.default = newDefault
    }

    handler.command.invoke([handler.addType(newType)])
  }

  const dialog = new EditTypeDialog(
    editor,
    handler.typeContainer,
    done,
    autocompletionWs,
    'Please create a new type'
  )
  const defaultColor = handler.typeContainer.getDefaultColor()

  dialog.update(null, '', defaultColor, false)
  dialog.open()
}
