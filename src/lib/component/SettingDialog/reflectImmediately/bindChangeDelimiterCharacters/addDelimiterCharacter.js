export default function addDelimiterCharacter(target) {
  const targetRow = target.closest('tr')
  const input = targetRow.querySelector('input')
  const newValue = input.value
  if (newValue) {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
      <td>
        <input
          style="width: 100%;"
          class="textae-editor__setting-dialog__delimiter-character-input"
          type="text"
          value="${newValue}">
      </td>
      <td><button class="textae-editor__setting-dialog__delimiter-character-delete">&times;</button></td>
  `

    // Add newRow to above + button
    targetRow.parentElement.insertBefore(newRow, targetRow)

    // Clear input
    input.value = ''
  }
}
