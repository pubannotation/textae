import getForwardMatchType from './getForwardMatchType'

export default function(
  labelOrColor,
  definedTypes,
  id,
  defaultValue,
  dismissForwardMatch
) {
  // Return value if perfectly matched
  if (definedTypes.get(id) && definedTypes.get(id)[labelOrColor]) {
    return definedTypes.get(id)[labelOrColor]
  }

  // Return value if forward matched
  if (!dismissForwardMatch) {
    const forwardMatchType = getForwardMatchType(definedTypes, id)

    if (forwardMatchType && forwardMatchType[labelOrColor]) {
      return forwardMatchType[labelOrColor]
    }
  }

  return defaultValue
}
