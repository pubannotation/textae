import eskape from 'eskape'
import getDisplayName from '../../../../getDisplayName'
import getURI from '../../../../getURI'

export default function (namespace, definitionContainer, value) {
  const displayName = getDisplayName(
    namespace,
    value,
    definitionContainer.getLabel(value)
  )
  const href = getURI(namespace, value, definitionContainer.getUri(value))
  return href ? eskape`<a href="#">${displayName}</a>` : eskape`${displayName}`
}
