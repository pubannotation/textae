import idFactory from '../../../../../../idFactory'

export default function(editor, typeContainer, entity) {
  const element = document.createElement('div')

  element.setAttribute('id', idFactory.makeEntityDomId(editor, entity.id))
  element.setAttribute('title', entity.id)
  element.classList.add('textae-editor__entity')

  element.style.borderColor = typeContainer.getColor(entity.typeName)

  return element
}
