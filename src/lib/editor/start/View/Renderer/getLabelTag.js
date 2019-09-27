import getLabel from './getLabel'
import getUri from './getUri'

export default function(namespace, typeContainer, type) {
  const label = getLabel(namespace, typeContainer, type)
  const href = getUri(namespace, typeContainer, type)
  if (href) {
    return `<a target="_blank"/ href="${href}">${label}</a>`
  } else {
    return label
  }
}
