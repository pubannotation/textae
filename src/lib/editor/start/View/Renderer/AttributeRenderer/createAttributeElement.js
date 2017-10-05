import idFactory from '../../../../idFactory'
import createAttributePopupEditorElement from './createAttributePopupEditorElement'

export default function(editor, typeContainer, attributeModel) {
  let element = document.createElement('div'),
    popUpEditorElement = createAttributePopupEditorElement()

  element.setAttribute('id', idFactory.makeAttributeDomId(editor, attributeModel.id))
  element.setAttribute('title', attributeModel.id)
  element.setAttribute('type', attributeModel.type)
  element.setAttribute('pred', attributeModel.pred)
  element.classList.add('textae-editor__attribute')
  element.style.borderColor = typeContainer.getColor(attributeModel.type)
  element.innerText = attributeModel.type || 'something'

  element.appendChild(popUpEditorElement)

  return element
}
