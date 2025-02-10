import anemone from '../../anemone'
import alertifyjs from 'alertifyjs'

export default function addCharacterRow(content, type) {
  const input = content.querySelector(
    `.textae-editor__setting-dialog__${type}-character-add-input`
  )
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

  const newRow = anemone`
  <tr class="textae-editor__setting-dialog__${type}-character-row">
    <td>
      <input
        class="textae-editor__setting-dialog__${type}-character-input"
        type="text"
        value="${newValue}">
    </td>
    <td><button class="textae-editor__setting-dialog__${type}-character-delete">&times;</button></td>
  </tr>`

  // Add newRow below the "+" button row.
  const addRow = content.querySelector(
    `.textae-editor__setting-dialog__${type}-character-add-row`
  )
  addRow.insertAdjacentHTML('afterend', newRow)

  // Clear input
  input.value = ''
}
