import eskape from 'eskape'
import getDisplayName from '../../../../getDisplayName'
import getUri from '../../../../getUri'

export default function (namespace, definitionContainer, value) {
  const displayName = getDisplayName(
    namespace,
    value,
    definitionContainer.getLabel(value)
  )
  const href = getUri(namespace, value, definitionContainer.getUri(value))
  return href
    ? eskape`<a target="_blank" href="${href}">${displayName}</a>`
    : eskape`${displayName}`
}
