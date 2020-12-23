export default function (showDefault, _default) {
  return showDefault
    ? `
    <div class="textae-editor__add-value-to-attribute-dialog__default">
      <label>default:</label><br>
      <input type="checkbox" ${_default ? `checked="checked"` : ``}>
    </div>
    `
    : ``
}
