import anemone from '../../../anemone'
import validateCharacter from './validateCharacter'

export default function addCharacterRow(content, type) {
  const input = content.querySelector(
    `.textae-editor__setting-dialog__${type}-character-add-input`
  )
  const newValue = input.value
  const currentCharacters = Array.from(
    content.querySelectorAll(
      `.textae-editor__setting-dialog__${type}-character`
    )
  ).map((span) => span.textContent)

  if (!validateCharacter(newValue, currentCharacters)) return

  const newRow = anemone`
  <tr class="textae-editor__setting-dialog__${type}-character-row">
    <td>
      <span class="textae-editor__setting-dialog__${type}-character">${newValue}</span>
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
