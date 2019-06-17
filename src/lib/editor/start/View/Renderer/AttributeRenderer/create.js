import idFactory from '../../../../idFactory'
import getEntityDom from '../../../getEntityDom'
import createAttributeElement from './createAttributeElement'
import $ from 'jquery'

export default function(editor, attributeModel) {
  let entityDom = getEntityDom(editor[0], attributeModel.subj)
  if (!entityDom) {
    throw new Error("entity is not rendered : " + attributeModel.subj)
  }

  // Check the attribute is not rendered already because this function also is called when moving span.
  const id = idFactory.makeAttributeDomId(editor, attributeModel.id)
  if (!document.querySelector(`#${id}`)) {
    let $label = $(entityDom.parentNode.nextElementSibling),
    $attribute = createAttributeElement(editor, attributeModel)
    $label.append($attribute)
  }
}
