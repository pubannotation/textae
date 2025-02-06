import anemone from '../../anemone'

export default function addCharacterRow(target, type) {
  const addRow = target.closest('tr')
  const input = addRow.querySelector('input')
  const newValue = input.value
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
