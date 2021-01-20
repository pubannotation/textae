import escape from 'lodash.escape'

export default function (value, entityContainer) {
  const label = escape(entityContainer.getLabel(value)) || ''

  return `
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
  `
}
