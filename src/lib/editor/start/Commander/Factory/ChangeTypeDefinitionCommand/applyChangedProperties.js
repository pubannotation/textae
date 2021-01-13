export default function (changedProperties, oldType) {
  const newType = Object.assign({}, oldType)
  const revertChangedProperties = new Map()

  // change config
  for (const [key, property] of changedProperties.entries()) {
    if (property === null && typeof oldType[key] !== 'undefined') {
      delete newType[key]
      revertChangedProperties.set(key, oldType[key])
    } else if (property !== null) {
      newType[key] = property
      revertChangedProperties.set(
        key,
        typeof oldType[key] === 'undefined' ? null : oldType[key]
      )
    }
  }

  return [newType, revertChangedProperties]
}
