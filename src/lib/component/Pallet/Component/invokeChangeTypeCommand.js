export default function(before, after, handler) {
  const changedProperties = {}

  if (before.id !== after.id) {
    changedProperties.id = after.id
  }

  if (before.label !== after.label) {
    changedProperties.label = after.label === '' ? null : after.label
  }

  if (before.color !== after.color) {
    changedProperties.color = after.color === '' ? null : after.color
  }

  if (before.isDefault !== after.isDefault) {
    changedProperties.default = after.isDefault ? true : null
  }

  if (Object.keys(changedProperties).length) {
    handler.command.invoke([handler.changeType(before, changedProperties)])
  }
}
