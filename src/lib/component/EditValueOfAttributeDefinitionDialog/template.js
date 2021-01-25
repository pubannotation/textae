import inputDefault from './inputDefault'

export default function (context) {
  const {
    labelForRangeOrIdOrPattern,
    rangeOrIdOrPattern,
    showDefault,
    default: defaultValue,
    label,
    color
  } = context

  return `
<div class="textae-editor__add-value-to-attribute-dialog__container">
  <div class="textae-editor__add-value-to-attribute-dialog__row">
    <div class="textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern textae-editor__promise-daialog__observable-element">
      <label>${labelForRangeOrIdOrPattern}:</label><br>
      <input value="${rangeOrIdOrPattern || ''}">
    </div>
    ${inputDefault(showDefault, defaultValue)}
    <div class="textae-editor__add-value-to-attribute-dialog__label">
      <label>label:</label><br>
      <input value="${label || ''}">
    </div>
    <div class="textae-editor__add-value-to-attribute-dialog__color">
      <label>color:</label><br>
      <input value="${color || ''}">
    </div>
  </div>
</div>`
}
