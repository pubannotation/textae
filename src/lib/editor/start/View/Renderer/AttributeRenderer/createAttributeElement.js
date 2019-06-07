import idFactory from '../../../../idFactory'
import createAttributePopupEditorElement from './createAttributePopupEditorElement'

export default function(editor, attribute) {
  let element = document.createElement('div'),
    popUpEditorElement = createAttributePopupEditorElement()

  element.setAttribute('id', idFactory.makeAttributeDomId(editor, attribute.id))
  element.setAttribute('title', 'id: ' + attribute.id + ', pred: ' + attribute.pred + ', value: ' + attribute.value)
  element.setAttribute('origin-id', attribute.id)
  element.setAttribute('type', attribute.value)
  element.setAttribute('pred', attribute.pred)
  element.classList.add('textae-editor__attribute')
  element.innerText = attribute.value

  element.appendChild(popUpEditorElement)

  return element
}
