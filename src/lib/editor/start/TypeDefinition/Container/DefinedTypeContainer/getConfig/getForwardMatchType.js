import getForwardMatchTypes from './getForwardMatchTypes'
import getLongestIdMatchType from './getLongestIdMatchType'

export default function (definedTypes, id) {
  // '*' at the last char of id means wildcard.
  const forwardMatchTypes = getForwardMatchTypes(definedTypes.ids(), id)

  if (forwardMatchTypes.length === 0) {
    return null
  }

  // If some wildcard-id are matched, return the type of the most longest matched.
  return definedTypes.get(getLongestIdMatchType(forwardMatchTypes))
}
