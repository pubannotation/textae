export default function(editor, attribute) {
  let boxElement = document.createElement('div')
  boxElement.classList.add('textae-editor__attribute-buttons')

  let editButtonElement = document.createElement('div')
  editButtonElement.classList.add('textae-editor__attribute-button')
  editButtonElement.classList.add('textae-editor__attribute-button--edit')
  editButtonElement.setAttribute('title', 'Edit this attribute.')

  let deleteButtonElement = document.createElement('div')
  deleteButtonElement.classList.add('textae-editor__attribute-button')
  deleteButtonElement.classList.add('textae-editor__attribute-button--delete')
  deleteButtonElement.setAttribute('title', 'Delete this attribute.')

  boxElement.appendChild(editButtonElement)
  boxElement.appendChild(deleteButtonElement)

  return boxElement
}
