import idFactory from '../../../../idFactory'
import getEntityDom from '../../../getEntityDom'
import createAttributeHtml from './createAttributeHtml'

export default function(editor, attribute) {
  const entityDom = getEntityDom(editor[0], attribute.subj)
  if (!entityDom) {
    throw new Error("entity is not rendered : " + attribute.subj)
  }

  // Check the attribute is not rendered already because this function also is called when moving span.
  const id = idFactory.makeAttributeDomId(editor, attribute.id)
  if (!document.querySelector(`#${id}`)) {
    const label = entityDom.parentNode.nextElementSibling
    const html = createAttributeHtml(id, attribute)
    label.insertAdjacentHTML('beforeend', html)
  }
}
