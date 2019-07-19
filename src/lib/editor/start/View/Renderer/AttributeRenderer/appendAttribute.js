import createAttributeHtml from './createAttributeHtml'
import getLabelDomOfType from '../../../getLabelDomOfType'

export default function(typeDom, attribute) {
  const label = getLabelDomOfType(typeDom)
  const id = `${typeDom.id}-${attribute.id}`

  // Check the attribute is not rendered already because this function also is called when moving span.
  if (typeDom.querySelector(`#${id}`)) {
    return
  }

  label.insertAdjacentHTML('afterend', createAttributeHtml(id, attribute))
}
