import uri from '../../../../uri'
import getDisplayName from './getDisplayName'

export default function setLabelToTypeLabel(typeLabel, namespace, typeContainer, type) {
  const label = getLabel(namespace, typeContainer, type)
  const href = getUri(namespace, typeContainer, type)

  // Keep the attributes html not to be overwrote the following 'innerHTML'.
  const childAttributesHtml = getChildAttributesHtml(typeLabel)

  if (href) {
    typeLabel.innerHTML = `<a target="_blank"/ href="${href}">${label}</a>` + childAttributesHtml
  } else {
    typeLabel.innerHTML = label + childAttributesHtml
  }
}

function getLabel(namespace, typeContainer, typeId) {
  const match = getMatchPrefix(namespace, typeId)

  // When a type id has label attrdute.
  if (typeContainer.getLabel(typeId)) {
    return typeContainer.getLabel(typeId)
  }

  // When a type id is uri
  if (uri.isUri(typeId)) {
    return getDisplayName(typeId)
  }

  if (match) {
    return typeId.replace(match.prefix + ':', '')
  }

  return typeId
}

function getUri(namespace, typeContainer, type) {
  if (uri.isUri(type)) {
    return type
  } else if (typeContainer.getUri(type)) {
    return typeContainer.getUri(type)
  } else if (namespace.some()) {
    let match = getMatchPrefix(namespace, type)
    if (match) {
      return match.uri + type.replace(`${match.prefix}:`, '')
    }

    let base = namespace.all().filter(namespace => namespace.prefix === '_base')
    if (base.length === 1) {
      return base[0].uri + type
    }
  }

  return null
}

function getMatchPrefix(namespace, type) {
  const namespaces = namespace.all()
  const matchs = namespaces
    .filter(namespace => namespace.prefix !== '_base')
    .filter(namespace => {
      return type.indexOf(namespace.prefix + ':') === 0
    })

  if (matchs.length === 1)
    return matchs[0]

  return null
}

function getChildAttributesHtml(typeLabel) {
  return Array.prototype.reduce.call(typeLabel.querySelectorAll('.textae-editor__attribute'), (carry, attribute) => {
    return carry + attribute.outerHTML
  }, '')
}

