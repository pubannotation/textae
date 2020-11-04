import getForwardMatchType from './getForwardMatchType'

export default function (definedTypes, id) {
  // Return value if perfectly matched
  if (definedTypes.has(id)) {
    return definedTypes.get(id)
  }

  // Return value if forward matched
  return getForwardMatchType(definedTypes, id)
}
