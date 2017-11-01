import idFactory from '../../../../idFactory'
import createAttributePopupEditorElement from './createAttributePopupEditorElement'

export default function(editor, typeContainer, attribute) {
  let element = document.createElement('div'),
    popUpEditorElement = createAttributePopupEditorElement()

  element.setAttribute('id', idFactory.makeAttributeDomId(editor, attribute.id))
  element.setAttribute('title', attribute.id)
  element.setAttribute('type', attribute.type)
  element.classList.add('textae-editor__attribute')
  element.style.borderColor = typeContainer.getColor(attribute.type)
  element.innerText = attribute.obj

  element.appendChild(popUpEditorElement)

  return element
}
