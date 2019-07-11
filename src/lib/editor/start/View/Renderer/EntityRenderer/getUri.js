import uri from '../../../../uri'
import getMatchPrefix from "./getMatchPrefix"
export default function(namespace, typeContainer, type) {
  if (uri.isUri(type)) {
    return type
  } else if (typeContainer.getUri(type)) {
    return typeContainer.getUri(type)
  } else if (namespace.some()) {
    const match = getMatchPrefix(namespace, type)
    if (match) {
      return match.uri + type.replace(`${match.prefix}:`, '')
    }

    const base = namespace.all().filter(namespace => namespace.prefix === '_base')
    if (base.length === 1) {
      return base[0].uri + type
    }
  }
  return null
}
