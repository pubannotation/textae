export default function(definedTypes, id) {
  // '*' at the last char of id means wildcard.
  const forwardMatchTypes = getForwardMatchTypes(definedTypes, id)

  if (forwardMatchTypes.length === 0) {
    return null
  }

  // If some wildcard-id are matched, return the type of the most longest matched.
  return definedTypes.get(getLogestIdMatchType(forwardMatchTypes))
}

function getForwardMatchTypes(definedTypes, id) {
  const forwardMatchTypes = []

  for (const definedType of definedTypes.keys()) {
    if (
      definedType.indexOf('*') !== -1 &&
      id.indexOf(definedType.slice(0, -1)) === 0
    ) {
      forwardMatchTypes.push(definedType)
    }
  }

  return forwardMatchTypes
}

function getLogestIdMatchType(typeIds) {
  let longestMatchId = ''

  for (const id of typeIds) {
    if (id.length > longestMatchId.length) {
      longestMatchId = id
    }
  }

  return longestMatchId
}
