import toLabel from '../../../../EntityModel/createEntityHTMLElement/toLabel'
import getDisplayName from '../../../../getDisplayName'
import getUri from '../../../../getUri'

export default function (namespace, typeContainer, value) {
  const label = getDisplayName(namespace, value, typeContainer.getLabel(value))
  const href = getUri(namespace, value, typeContainer.getUri(value))
  return toLabel(href, label)
}
