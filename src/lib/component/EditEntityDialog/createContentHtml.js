function toAttributeHTML(pred, obj, editDisabled) {
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

function toEntityHTML(value, label, attributes) {
  return `
  <div class="textae-editor__edit-type-dialog__container">
    <div class="textae-editor__edit-type-dialog__type">
      <div class="textae-editor__edit-type-dialog__type__predicate">
        <label>Predicate:</label><br>
        <span class="textae-editor__edit-type-dialog__type__predicate__value">type</span>
      </div>
      <div class="textae-editor__edit-type-dialog__type__value ui-front">
        <label>Value:</label><br>
        <input class="textae-editor__edit-type-dialog__type__value__value textae-editor__promise-daialog__observable-element" value="${value}">
      </div>
      <div class="textae-editor__edit-type-dialog__type__label">
        <label>Label:</label><br>
        <span class="textae-editor__edit-type-dialog__type__label__value">${label}</span>
      </div>
    </div>
    <div class="textae-editor__edit-type-dialog__attributes">
      ${attributes
        .map((a) => toAttributeHTML(a.pred, a.obj, a.editDisabled))
        .join('')}
    </div>
  </div>`
}

export default function (content) {
  return toEntityHTML(content.value, content.label, content.attributes)
}
