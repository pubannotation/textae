import anemone from '../anemone'

export default function template(context) {
  const { id, label, color, isDefault } = context
  return anemone`
<div class="textae-editor__type-definition-dialog__container">
  <div class="textae-editor__type-definition-dialog__row ui-front">
    <label>Id</label>
    <input
      class="textae-editor__type-definition-dialog--id textae-editor__promise-dialog__observable-element"
      value="${id || ''}">
  </div>
  <div class="textae-editor__type-definition-dialog__row ui-front">
    <label>Label<span></span></label>
    <input
      class ="textae-editor__promise-dialog__observable-element"
      value="${label}">
  </div>
  <div class="textae-editor__type-definition-dialog__color-picker">
    <label><input
      class="textae-editor__type-definition-dialog__color-picker__input"
      type="color"
      value="${color}">
    Color</label>
  </div>
  <div class="textae-editor__type-definition-dialog__set-default">
    <label><input
      class="textae-editor__type-definition-dialog__set-default__input"
      type="checkbox" ${
        isDefault ? 'checked="checked" disabled="disabled"' : ''
      }>
    Default type</label>
  </div>
</div>`
}
