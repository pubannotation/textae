import getLabel from '../getLabel'
import getUri from '../getUri'
import getChildAttributesHtml from './getChildAttributesHtml'

export default function(typeLabel, namespace, typeDefinition, type) {
  const label = getLabel(namespace, typeDefinition, type)
  const href = getUri(namespace, typeDefinition, type)

  // Keep the attributes html not to be overwrote the following 'innerHTML'.
  const childAttributesHtml = getChildAttributesHtml(typeLabel)

  if (href) {
    typeLabel.innerHTML = `<a target="_blank"/ href="${href}">${label}</a>${childAttributesHtml}`
  } else {
    typeLabel.innerHTML = label + childAttributesHtml
  }
}
