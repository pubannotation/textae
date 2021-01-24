import toAnchorElement from '../../../../toAnchorElement'
import getDisplayName from '../../../../getDisplayName'
import getUri from '../../../../getUri'

export default function (namespace, typeContainer, value) {
  const displayName = getDisplayName(
    namespace,
    value,
    typeContainer.getLabel(value)
  )
  const href = getUri(namespace, value, typeContainer.getUri(value))
  return toAnchorElement(displayName, href)
}
