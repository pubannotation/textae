import isURI from '../../isURI'
import getMatchPrefix from '../getMatchPrefix'
import getDisplayNameFromUri from './getDisplayNameFromUri'

export default function (namespace, value, displayName) {
  // When a type id has label attrdute.
  if (displayName) {
    return displayName
  }

  // When a type id is uri
  if (isURI(value)) {
    return getDisplayNameFromUri(value)
  }

  const match = getMatchPrefix(namespace, value)
  if (match) {
    return value.replace(`${match.prefix}:`, '')
  }

  return value
}
