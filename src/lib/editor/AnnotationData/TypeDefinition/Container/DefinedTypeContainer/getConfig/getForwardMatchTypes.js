export default function (typeIds, id) {
  const forwardMatchTypes = []

  for (const definedType of typeIds) {
    if (
      definedType.indexOf('*') !== -1 &&
      id.indexOf(definedType.slice(0, -1)) === 0
    ) {
      forwardMatchTypes.push(definedType)
    }
  }

  return forwardMatchTypes
}
