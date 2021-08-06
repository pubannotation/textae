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
    <label>${labelForRangeOrIdOrPattern}</label>
    <input
      value="${rangeOrIdOrPattern || ''}"
      class="textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern textae-editor__promise-daialog__observable-element"
    >
  </div>
  ${inputDefault(showDefault, defaultValue)}
  <div class="textae-editor__add-value-to-attribute-dialog__row">
    <label>label</label>
    <input
      value="${label || ''}"
      class="textae-editor__add-value-to-attribute-dialog__label textae-editor__promise-daialog__observable-element"
    >
  </div>
  <div class="textae-editor__add-value-to-attribute-dialog__row">
    <label>
      <input
        type="color"
        value="${color || ''}"
        class="textae-editor__add-value-to-attribute-dialog__color"
      >
      color
    </label>
  </div>
</div>`
}
