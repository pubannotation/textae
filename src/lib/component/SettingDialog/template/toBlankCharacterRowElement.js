import escapeForDisplay from './escapeForDisplay'

export default function toBlankCharacterRowElement(char) {
  return `
<tr class="textae-editor__setting-dialog__blank-character-row">
  <td>
    <input
      type="text"
      class="textae-editor__setting-dialog__blank-character-input"
      value="${escapeForDisplay(char)}"
      readonly>
  </td>
  <td><button class="textae-editor__setting-dialog__blank-character-delete-button">&times;</button></td>
</tr>`
}
