export default function getForwardMatchTypes(typeIds, id) {
  if (typeof id !== 'string') {
    return []
  }

  const forwardMatchTypes = []

  for (const definedType of typeIds) {
    if (
      typeof definedType === 'string' &&
      definedType.indexOf('*') !== -1 &&
      id.indexOf(definedType.slice(0, -1)) === 0
    ) {
      forwardMatchTypes.push(definedType)
    }
  }

  return forwardMatchTypes
}
