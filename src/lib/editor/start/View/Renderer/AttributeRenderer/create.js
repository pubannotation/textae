import getEntityDom from '../../../getEntityDom'
import createAttributeElement from './createAttributeElement'
import $ from 'jquery'

export default function(editor, namspace, typeContainer, gridRenderer, attributeModel) {
  let entityDom = getEntityDom(editor[0], attributeModel.subj)
  if (!entityDom) {
    throw new Error("entity is not rendered : " + attributeModel.subj)
  }

  let $label = $(entityDom.parentNode.nextElementSibling),
    $attribute = createAttributeElement(editor, typeContainer, attributeModel)
  $label.append($attribute)

  return $attribute
}

// Create a grid unless it exists.
function getGrid(gridRenderer, spanId) {
  let grid = document.querySelector(`#G${spanId}`)

  return grid || gridRenderer.render(spanId)
}

