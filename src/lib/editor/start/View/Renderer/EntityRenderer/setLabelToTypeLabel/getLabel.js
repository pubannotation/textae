import uri from '../../../../../uri'
import getDisplayName from '../getDisplayName'
import getMatchPrefix from "./getMatchPrefix"

export default function(namespace, typeContainer, typeId) {
  const match = getMatchPrefix(namespace, typeId)

  // When a type id has label attrdute.
  if (typeContainer.getLabel(typeId)) {
    return typeContainer.getLabel(typeId)
  }

  // When a type id is uri
  if (uri.isUri(typeId)) {
    return getDisplayName(typeId)
  }

  if (match) {
    return typeId.replace(`${match.prefix}:`, '')
  }

  return typeId
}
