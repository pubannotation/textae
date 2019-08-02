export default function populate(changeValues, oldType) {
  const newType = Object.assign({}, oldType)
  const revertChangeValues = {}

  Object.keys(changeValues).forEach((key) => {
    if (changeValues[key] === null && typeof oldType[key] !== 'undefined') {
      delete newType[key]
      revertChangeValues[key] = oldType[key]
    } else if (changeValues[key] !== null) {
      newType[key] = changeValues[key]
      revertChangeValues[key] =
        typeof oldType[key] === 'undefined' ? null : oldType[key]
    }
  })

  return {
    newType,
    revertChangeValues
  }
}
