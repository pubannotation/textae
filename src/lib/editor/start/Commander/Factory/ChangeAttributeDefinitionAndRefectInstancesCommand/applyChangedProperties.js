export default function (oldAttrDef, changedProperties) {
  const newAttrDef = oldAttrDef.JSON
  const revertChangedProperties = new Map()
  // change config
  for (const [key, property] of changedProperties.entries()) {
    if (property === null && typeof oldAttrDef[key] !== 'undefined') {
      delete newAttrDef[key]
      revertChangedProperties.set(key, oldAttrDef[key])
    } else if (property !== null) {
      newAttrDef[key] = property
      revertChangedProperties.set(
        key,
        typeof oldAttrDef[key] === 'undefined' ? null : oldAttrDef[key]
      )
    }
  }
  return [newAttrDef, revertChangedProperties]
}
