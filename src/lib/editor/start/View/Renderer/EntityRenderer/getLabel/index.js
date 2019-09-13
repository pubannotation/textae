import isUri from '../isUri'
import getMatchPrefix from '../getMatchPrefix'
import getDisplayName from './getDisplayName'

export default function(namespace, typeDefinition, typeId) {
  const match = getMatchPrefix(namespace, typeId)

  // When a type id has label attrdute.
  if (typeDefinition.getLabel(typeId)) {
    return typeDefinition.getLabel(typeId)
  }

  // When a type id is uri
  if (isUri(typeId)) {
    return getDisplayName(typeId)
  }

  if (match) {
    return typeId.replace(`${match.prefix}:`, '')
  }

  return typeId
}
