import EditTypeDefinitionDialog from '../EditTypeDefinitionDialog'

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

    handler.commander.invoke(handler.addType(newType))
  }

  const dialog = new EditTypeDefinitionDialog(
    handler.typeContainer,
    done,
    autocompletionWs,
    'Please create a new type'
  )
  const defaultColor = handler.typeContainer.defaultColor

  dialog.update(null, '', defaultColor, false)
  dialog.open()
}
