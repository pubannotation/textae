import escape from 'lodash.escape'
import toAttributeHTML from './toAttributeHTML'

export default function (value, attributes, entityContainer) {
  const label = entityContainer.getLabel(value)

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
        <span class="textae-editor__edit-type-dialog__type__label__value">${
          escape(label) || ''
        }</span>
      </div>
    </div>
    <div class="textae-editor__edit-type-dialog__attributes">
      ${attributes
        .map((a) => toAttributeHTML(a.pred, a.obj, a.editDisabled))
        .join('')}
    </div>
  </div>`
}
