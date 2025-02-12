import escapeForDisplay from './escapeForDisplay'

export default function toDelimiterCharacterRowElement(char) {
  return `
<tr class="textae-editor__setting-dialog__delimiter-character-row">
  <td>
    <input
      type="text"
      class="textae-editor__setting-dialog__delimiter-character-input"
      value="${escapeForDisplay(char)}"
      readonly>
  </td>
  <td><button class="textae-editor__setting-dialog__delimiter-character-delete-button">&times;</button></td>
</tr>`
}
