import triggerUpdatePallet from './triggerUpdatePallet'

export default function(oldType, newType, handler, editor) {
  const changeValues = {}

  if (oldType.id !== newType.id) {
    changeValues.id = newType.id
  }

  if (oldType.label !== newType.label) {
    changeValues.label = newType.label === '' ? null : newType.label
  }

  if (oldType.color !== newType.color) {
    changeValues.color = newType.color === '' ? null : newType.color
  }

  if (oldType.isDefault !== newType.isDefault) {
    changeValues.default = newType.isDefault ? true : null
  }

  if (Object.keys(changeValues).length) {
    handler.command.invoke([handler.changeType(oldType, changeValues)], ['annotation', 'configuration'])
    triggerUpdatePallet(editor)
  }
}
