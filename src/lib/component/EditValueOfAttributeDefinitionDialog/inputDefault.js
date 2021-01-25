export default function (showDefault, defaultValue) {
  return showDefault
    ? `
    <div class="textae-editor__add-value-to-attribute-dialog__default">
      <label>default:</label><br>
      <input type="checkbox" ${defaultValue ? `checked="checked"` : ``}>
    </div>
    `
    : ``
}
