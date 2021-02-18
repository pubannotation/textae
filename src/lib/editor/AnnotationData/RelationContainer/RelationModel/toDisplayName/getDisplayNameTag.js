import toAnchorElement from '../../../../toAnchorElement'
import getDisplayName from '../../../../getDisplayName'
import getUri from '../../../../getUri'

export default function (namespace, definitionContainer, value) {
  const displayName = getDisplayName(
    namespace,
    value,
    definitionContainer.getLabel(value)
  )
  const href = getUri(namespace, value, definitionContainer.getUri(value))
  return toAnchorElement(displayName, href)
}
