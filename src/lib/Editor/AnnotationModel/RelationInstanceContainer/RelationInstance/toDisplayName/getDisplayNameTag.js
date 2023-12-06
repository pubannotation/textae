import getDisplayName from '../../../../getDisplayName'
import getURI from '../../../../getURI'
import anemone from '../../../../../component/anemone'

export default function (namespace, definitionContainer, value) {
  const displayName = getDisplayName(
    namespace,
    value,
    definitionContainer.getLabel(value)
  )
  const href = getURI(namespace, value, definitionContainer.getURI(value))
  return href
    ? anemone`<a href="#">${displayName}</a>`
    : anemone`${displayName}`
}
