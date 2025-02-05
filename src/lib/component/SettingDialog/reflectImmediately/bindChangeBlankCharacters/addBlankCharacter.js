import anemone from '../../../anemone'

export default function addBlankCharacter(target) {
  const targetRow = target.closest('tr')
  const input = targetRow.querySelector('input')
  const newValue = input.value
  if (newValue) {
    const newRow = document.createElement('tr')
    newRow.innerHTML = anemone`
      <td>
        <input
          class="textae-editor__setting-dialog__blank-character-input"
          type="text"
          value="${newValue}">
      </td>
      <td><button class="textae-editor__setting-dialog__blank-character-delete">&times;</button></td>
  `

    // Add newRow below the "+" button
    targetRow.parentElement.insertBefore(newRow, targetRow.nextElementSibling)

    // Clear input
    input.value = ''
  }
}
