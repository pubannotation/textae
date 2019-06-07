import getEntityDom from '../../../getEntityDom'
import createAttributeElement from './createAttributeElement'
import $ from 'jquery'

export default function(editor, attributeModel) {
  let entityDom = getEntityDom(editor[0], attributeModel.subj)
  if (!entityDom) {
    throw new Error("entity is not rendered : " + attributeModel.subj)
  }

  let $label = $(entityDom.parentNode.nextElementSibling),
    $attribute = createAttributeElement(editor, attributeModel)
  $label.append($attribute)

  return $attribute
}
