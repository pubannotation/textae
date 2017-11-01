import idFactory from '../../../../idFactory'

export default function(editor, typeContainer, attribute) {
  let element = document.createElement('div')

  element.setAttribute('id', idFactory.makeAttributeDomId(editor, attribute.id))
  element.setAttribute('title', attribute.id)
  element.setAttribute('type', attribute.type)
  element.classList.add('textae-editor__attribute')

  element.style.borderColor = typeContainer.getColor(attribute.type)

  element.innerText = attribute.obj

  return element
}
