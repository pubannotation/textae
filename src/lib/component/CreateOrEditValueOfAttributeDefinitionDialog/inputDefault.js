export default function (showDefault, defaultValue) {
  return showDefault
    ? `
    <div class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__row">
      <label>
        <input
          type="checkbox"
          ${defaultValue ? `checked="checked"` : ``}
          class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__default"
        >
        default
      </label>
    </div>
    `
    : ``
}
