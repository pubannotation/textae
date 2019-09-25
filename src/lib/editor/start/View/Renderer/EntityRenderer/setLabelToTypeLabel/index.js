import getChildAttributesHtml from './getChildAttributesHtml'
import getLabelTag from './getLabelTag'

export default function(typeLabel, namespace, typeContainer, type) {
  // Keep the attributes html not to be overwrote the following 'innerHTML'.
  const childAttributesHtml = getChildAttributesHtml(typeLabel)

  typeLabel.innerHTML =
    getLabelTag(namespace, typeContainer, type) + childAttributesHtml
}
