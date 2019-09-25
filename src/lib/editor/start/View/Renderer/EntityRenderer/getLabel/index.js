import isUri from '../isUri'
import getMatchPrefix from '../getMatchPrefix'
import getDisplayName from './getDisplayName'

export default function(namespace, typeCantainer, typeId) {
  const match = getMatchPrefix(namespace, typeId)

  // When a type id has label attrdute.
  if (typeCantainer.getLabel(typeId)) {
    return typeCantainer.getLabel(typeId)
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
