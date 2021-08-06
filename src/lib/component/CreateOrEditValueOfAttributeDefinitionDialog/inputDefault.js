export default function (showDefault, defaultValue) {
  return showDefault
    ? `
    <div class="textae-editor__add-value-to-attribute-dialog__row">
      <label>
        <input
          type="checkbox"
          ${defaultValue ? `checked="checked"` : ``}
          class="textae-editor__add-value-to-attribute-dialog__default"
        >
        default
      </label>
    </div>
    `
    : ``
}
