import escapeForDisplay from './escapeForDisplay'

export default function toBlankCharacterRowElement(char) {
  return `
<tr class="textae-editor__setting-dialog__blank-character-row">
  <td>
    <span class="textae-editor__setting-dialog__blank-character">${escapeForDisplay(char)}</span>
  </td>
  <td><button class="textae-editor__setting-dialog__blank-character-delete-button">&times;</button></td>
</tr>`
}
