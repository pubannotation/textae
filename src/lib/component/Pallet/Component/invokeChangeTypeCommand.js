export default function(before, after, handler) {
  const changeValues = {}

  if (before.id !== after.id) {
    changeValues.id = after.id
  }

  if (before.label !== after.label) {
    changeValues.label = after.label === '' ? null : after.label
  }

  if (before.color !== after.color) {
    changeValues.color = after.color === '' ? null : after.color
  }

  if (before.isDefault !== after.isDefault) {
    changeValues.default = after.isDefault ? true : null
  }

  if (Object.keys(changeValues).length) {
    handler.command.invoke([handler.changeType(before, changeValues)])
  }
}
