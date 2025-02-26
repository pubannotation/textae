import anemone from '../../../anemone'
import validateCharacter from './validateCharacter'
import alertifyjs from 'alertifyjs'

export default function addCharacterRow(content, type) {
  const input = content.querySelector(
    `.textae-editor__setting-dialog__${type}-character-add-input`
  )
  const newValue = input.value
  const currentCharacters = Array.from(
    content.querySelectorAll(
      `.textae-editor__setting-dialog__${type}-character-input`
    )
  ).map((input) => input.value)
  const errorMessage = validateCharacter(newValue, currentCharacters)

  if (errorMessage) {
    alertifyjs.warning(`${errorMessage}`)
    return
  }

  const newRow = anemone`
  <tr class="textae-editor__setting-dialog__${type}-character-row">
    <td>
      <input
        class="textae-editor__setting-dialog__${type}-character-input"
        type="text"
        value="${newValue}"
        readonly>
    </td>
    <td><button class="textae-editor__setting-dialog__${type}-character-delete-button">&times;</button></td>
  </tr>`

  // Add newRow below the "+" button row.
  const addRow = content.querySelector(
    `.textae-editor__setting-dialog__${type}-character-add-row`
  )
  addRow.insertAdjacentHTML('afterend', newRow)

  // Clear input
  input.value = ''
}
