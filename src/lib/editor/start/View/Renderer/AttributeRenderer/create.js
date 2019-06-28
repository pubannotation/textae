import idFactory from '../../../../idFactory'
import getEntityDom from '../../../getEntityDom'
import appendAttribute from './appendAttribute'


export default function(editor, attribute) {
  const entityDom = getEntityDom(editor[0], attribute.subj)
  if (!entityDom) {
    throw new Error("entity is not rendered : " + attribute.subj)
  }

  // Check the attribute is not rendered already because this function also is called when moving span.
  const id = idFactory.makeAttributeDomId(editor, attribute.id)
  if (!document.querySelector(`#${id}`)) {
    appendAttribute(editor, entityDom.parentNode, attribute)
  }
}
