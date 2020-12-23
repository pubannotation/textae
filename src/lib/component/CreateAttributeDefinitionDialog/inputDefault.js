export default function (showDefault, _default) {
  return showDefault
    ? `
    <div class="textae-editor__create-attribute-definition-dialog__default">
      <label>Default:</label><br>
      <input value="${_default || ''}">
    </div>
`
    : ``
}
