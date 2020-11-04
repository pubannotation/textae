import isUri from '../../isUri'
import getMatchPrefix from '../getMatchPrefix'
import getDisplayName from './getDisplayName'

export default function (namespace, value, label) {
  // When a type id has label attrdute.
  if (label) {
    return label
  }

  // When a type id is uri
  if (isUri(value)) {
    return getDisplayName(value)
  }

  const match = getMatchPrefix(namespace, value)
  if (match) {
    return value.replace(`${match.prefix}:`, '')
  }

  return value
}
