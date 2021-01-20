export default function (attribute) {
  const { pred, obj, editDisabled } = attribute

  return `
<div class="textae-editor__edit-type-dialog__attribute">
  <div class="textae-editor__edit-type-dialog__attribute__predicate">
    <label>Predicate:</label><br>
    <input class="textae-editor__edit-type-dialog__attribute__predicate__value" value="${pred}" disabled="disabled">
  </div>
  <div class="textae-editor__edit-type-dialog__attribute__value">
    <label>Value:</label><br>
    <input class="textae-editor__edit-type-dialog__attribute__value__value" value="${obj}" disabled="disabled">
  </div>
  <div class="textae-editor__edit-type-dialog__attribute__edit">
    <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__edit__value" data-predicate="${pred}"${
    editDisabled ? 'disabled="disabled"' : ''
  }>edit</button>
  </div>
  <div class="textae-editor__edit-type-dialog__attribute__remove">
    <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__remove__value">remove</button>
  </div>
</div>`
}
