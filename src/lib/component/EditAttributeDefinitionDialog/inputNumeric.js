export default function (min, max, step) {
  return `
    <div class="textae-editor__edit-attribute-definition-dialog__row">
      <div class="textae-editor__edit-attribute-definition-dialog__min">
        <label>Min:</label><br>
        <input type="text" value="${min || ''}">
      </div>
      <div class="textae-editor__edit-attribute-definition-dialog__max">
        <label>Max:</label><br>
        <input type="text" value="${max || ''}">
      </div>
      <div class="textae-editor__edit-attribute-definition-dialog__step">
        <label>Step:</label><br>
        <input type="text" value="${step || ''}">
      </div>
    </div>
  `
}
