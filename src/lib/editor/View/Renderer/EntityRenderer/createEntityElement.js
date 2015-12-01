import idFactory from '../../../idFactory'

export default function createEntityElement(editor, typeContainer, modification, entity) {
  let element = document.createElement('div')

  element.setAttribute('id', idFactory.makeEntityDomId(editor, entity.id))
  element.setAttribute('title', entity.id)
  element.setAttribute('type', entity.type)
  element.classList.add('textae-editor__entity')

  element.style.borderColor = typeContainer.getColor(entity.type)

  // Set css classes for modifications.
  modification.getClasses(entity.id)
    .forEach(c => {
      element.classList.add(c)
    })

  return element
}
