export default function(before, after) {
  const changedProperties = new Map()

  if (before.id !== after.id) {
    changedProperties.set('id', after.id)
  }

  if (before.label !== after.label) {
    changedProperties.set('label', after.label === '' ? null : after.label)
  }

  if (before.color !== after.color) {
    changedProperties.set('color', after.color === '' ? null : after.color)
  }

  if (before.isDefault !== after.isDefault) {
    changedProperties.set('default', after.isDefault ? true : null)
  }

  return changedProperties
}
