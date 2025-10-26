import anemone from '../../anemone'
import toBlankCharacterRowElement from './toBlankCharacterRowElement'
import toDelimiterCharacterRowElement from './toDelimiterCharacterRowElement'
import toFunctionAvailabilityLabelElement from './toFunctionAvailabilityLabelElement'

export default function template(context) {
  const {
    typeGap,
    typeGapDisabled,
    lineHeight,
    autocompletionWs,
    typeDictionaryLocked,
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
  <div class="textae-editor__setting-dialog__details">
    <details>
      <summary>Delimiter Characters</summary>
      <table>
        <tr class="textae-editor__setting-dialog__delimiter-character-add-row">
          <td><input class="textae-editor__setting-dialog__delimiter-character-add-input" type="text"></td>
          <td><button class="textae-editor__setting-dialog__delimiter-character-add-button">+</button></td>
        </tr>
        ${() =>
          delimiterCharacters
            .slice()
            .reverse()
            .map((char) => toDelimiterCharacterRowElement(char))
            .join('')}
      </table>
    </details>
  </div>
  <div class="textae-editor__setting-dialog__details">
    <details>
      <summary>Non-edge Characters</summary>
      <table>
        <tr class="textae-editor__setting-dialog__blank-character-add-row">
          <td><input class="textae-editor__setting-dialog__blank-character-add-input" type="text"></td>
           <td><button class="textae-editor__setting-dialog__blank-character-add-button">+</button></td>
        </tr>
        ${() =>
          blankCharacters
            .slice()
            .reverse()
            .map((char) => toBlankCharacterRowElement(char))
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
            .map((name) =>
              toFunctionAvailabilityLabelElement(functionAvailability, name)
            )
            .join('')}
      </div>
    </details>
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
    <label>Version ${version}</label>
  </div>
</div>
`
}
