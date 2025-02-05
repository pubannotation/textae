import anemone from '../../../anemone'

export default function addDelimiterCharacter(target) {
  const targetRow = target.closest('tr')
  const input = targetRow.querySelector('input')
  const newValue = input.value
  if (newValue) {
    const newRow = document.createElement('tr')
    newRow.innerHTML = anemone`
      <td>
        <input
          class="textae-editor__setting-dialog__delimiter-character-input"
          type="text"
          value="${newValue}">
      </td>
      <td><button class="textae-editor__setting-dialog__delimiter-character-delete">&times;</button></td>
  `

    // Add newRow below the "+" button
    targetRow.parentElement.insertBefore(newRow, targetRow.nextElementSibling)

    // Clear input
    input.value = ''
  }
}
