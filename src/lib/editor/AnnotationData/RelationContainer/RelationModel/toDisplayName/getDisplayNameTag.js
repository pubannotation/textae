import getDisplayName from '../../../../getDisplayName'
import getUri from '../../../../getUri'

export default function (namespace, typeContainer, value) {
  const label = getDisplayName(namespace, value, typeContainer.getLabel(value))
  const href = getUri(namespace, value, typeContainer.getUri(value))
  if (href) {
    return `<a target="_blank"/ href="${href}">${label}</a>`
  } else {
    return label
  }
}
