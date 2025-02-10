import anemone from '../../anemone'
import alertifyjs from 'alertifyjs'

export default function addCharacterRow(content, target, type) {
  const addRow = target.closest('tr')
  const input = addRow.querySelector('input')
  const newValue = input.value

  // Return with alert when new character already exists.
  const currentCharacters = Array.from(
    content.querySelectorAll(
      `.textae-editor__setting-dialog__${type}-character-input`
    )
  ).map((input) => input.value)

  if (currentCharacters.includes(newValue)) {
    alertifyjs.warning(`${newValue} is already added.`)
    return
  }

  const newRow = document.createElement('tr')
  newRow.innerHTML = anemone`
    <td>
      <input
        class="textae-editor__setting-dialog__${type}-character-input"
        type="text"
        value="${newValue}">
    </td>
    <td><button class="textae-editor__setting-dialog__${type}-character-delete">&times;</button></td>`

  // Add newRow below the "+" button
  addRow.parentElement.insertBefore(newRow, addRow.nextElementSibling)

  // Clear input
  input.value = ''
}
