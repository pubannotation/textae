import anemone from '../../anemone'
import escapeForDisplay from './escapeForDisplay'

export default function template(context) {
  const {
    typeGap,
    typeGapDisabled,
    lineHeight,
    autocompletionWs,
    typeDictionaryLocked,
    autosave,
    autoLineheight,
    boundaryDetection,
    delimiterCharacters,
    blankCharacters,
    functionAvailability,
    version
  } = context

  return anemone`
<div class="textae-editor__setting-dialog__container">
  <div class="textae-editor__setting-dialog__row">
    <label>Type Gap</label>
    <input
      type="number"
      class="textae-editor__setting-dialog__type-gap-text"
      step="1"
      min="0"
      max="5"
      value="${typeGap}" ${typeGapDisabled ? `disabled="disabled"` : ''}>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>Line Height(px)</label>
    <input
      type="number" class="textae-editor__setting-dialog__line-height-text"
      step="1"
      min="50"
      max="500"
      value="${lineHeight}">
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>Autocompletion_ws</label>
    <input
      type="text"
      class="textae-editor__setting-dialog__autocompletion_ws-text"
      value="${autocompletionWs}">
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>
      <input
        type="checkbox"
        class="textae-editor__setting-dialog__lock-config-text"
        ${typeDictionaryLocked ? `checked="checked"` : ''}>
      Lock Edit Config
    </label>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>
      <input
        type="checkbox"
        class="textae-editor__setting-dialog__auto-save-text"
        ${autosave ? `checked="checked"` : ''}>
      Auto Save
    </label>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>
      <input
      type="checkbox"
      class="textae-editor__setting-dialog__auto-line-height-text"
      ${autoLineheight ? `checked="checked"` : ''}>
      Auto Line Height
    </label>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>
      <input
        type="checkbox"
        class="textae-editor__setting-dialog__boundary-detection-text"
        ${boundaryDetection ? `checked="checked"` : ''}>
      Boundary Detection
    </label>
  </div>
  <div class="textae-editor__setting-dialog__details">
    <details>
      <summary>Delimiter Characters</summary>
      <table>
        <tr>
          <td><input type="text"></td>
          <td><button class="textae-editor__setting-dialog__delimiter-character-add">+</button></td>
        </tr>
        ${() =>
          delimiterCharacters
            .map((char) => {
              return `<tr>
            <td>
              <input
                type="text"
                class="textae-editor__setting-dialog__delimiter-character-input"
                value="${escapeForDisplay(char)}">
            </td>
            <td><button class="textae-editor__setting-dialog__delimiter-character-delete">&times;</button></td>
          </tr>`
            })
            .join('')}
      </table>
    </details>
  </div>
  <div class="textae-editor__setting-dialog__details">
    <details>
      <summary>Non-edge Characters</summary>
      <table>
        <tr>
          <td><input type="text"></td>
           <td><button class="textae-editor__setting-dialog__blank-character-add">+</button></td>
        </tr>
        ${() =>
          blankCharacters
            .map(
              (char) => `
          <tr>
            <td>
              <input
                type="text"
                class="textae-editor__setting-dialog__blank-character-input"
                value="${escapeForDisplay(char)}">
            </td>
            <td><button class="textae-editor__setting-dialog__blank-character-delete">&times;</button></td>
          </tr>`
            )
            .join('')}
      </table>
    </details>
  </div>
  <div class="textae-editor__setting-dialog__details">
    <details>
      <summary>Function Availability</summary>
      <div class="textae-editor__setting-dialog__function-availability-list">
        ${() =>
          functionAvailability.names
            .map(
              (name) => `
          <label>
            <input
              type="checkbox"
              class="textae-editor__setting-dialog__function-availability-checkbox"
              ${functionAvailability.isAvailable(name) ? `checked="checked"` : ''}>
            ${name}
          </label>`
            )
            .join('')}
      </div>
    </details>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>Version ${version}</label>
  </div>
</div>
`
}
