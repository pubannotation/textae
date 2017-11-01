export default function(editor, typeContainer, attribute) {
  let boxElement = document.createElement('div')
  boxElement.classList.add('textae-editor__attribute-buttons')

  let addButtonElement = document.createElement('div')
  addButtonElement.classList.add('textae-editor__attribute-button')
  addButtonElement.classList.add('textae-editor__attribute-button--add')

  let editButtonElement = document.createElement('div')
  editButtonElement.classList.add('textae-editor__attribute-button')
  editButtonElement.classList.add('textae-editor__attribute-button--edit')

  let deleteButtonElement = document.createElement('div')
  deleteButtonElement.classList.add('textae-editor__attribute-button')
  deleteButtonElement.classList.add('textae-editor__attribute-button--delete')

  boxElement.appendChild(addButtonElement)
  boxElement.appendChild(editButtonElement)
  boxElement.appendChild(deleteButtonElement)

  return boxElement
}
