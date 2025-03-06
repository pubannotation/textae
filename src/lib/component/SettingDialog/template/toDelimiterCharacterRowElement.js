import escapeForDisplay from './escapeForDisplay'

export default function toDelimiterCharacterRowElement(char) {
  return `
<tr class="textae-editor__setting-dialog__delimiter-character-row">
  <td>
    <span class="textae-editor__setting-dialog__delimiter-character">${escapeForDisplay(char)}</span>
  </td>
  <td><button class="textae-editor__setting-dialog__delimiter-character-delete-button">&times;</button></td>
</tr>`
}
