import isURI from '../isURI'
import getMatchPrefix from './getMatchPrefix'

export default function (namespace, value, uri) {
  if (isURI(value)) {
    return value
  }

  if (uri) {
    return uri
  }

  if (namespace.some) {
    const match = getMatchPrefix(namespace, value)

    if (match) {
      return `${match.uri}${value.replace(`${match.prefix}:`, '')}`
    }

    const base = namespace.all.find((namespace) => namespace.prefix === '_base')
    if (base) {
      return `${base.uri}${value}`
    }
  }

  return null
}
