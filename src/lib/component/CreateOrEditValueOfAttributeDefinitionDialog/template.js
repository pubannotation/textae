import { escape } from 'lodash'
import getRandomColorString from '../getRandomColorString'
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
<div class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__container">
  <div class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__row">
    <label>${labelForRangeOrIdOrPattern}</label>
    <input
      value="${rangeOrIdOrPattern || ''}"
      class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__range_or_id_or_pattern textae-editor__promise-dialog__observable-element"
    >
  </div>
  ${inputDefault(showDefault, defaultValue)}
  <div class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__row">
    <label>label</label>
    <input
      value="${escape(label) || ''}"
      class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__label textae-editor__promise-dialog__observable-element"
    >
  </div>
  <div class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__row">
    <label>
      <input
        type="color"
        value="${color || getRandomColorString()}"
        class="textae-editor__create-or-edit-value-of-attribute-definition-dialog__color"
      >
      color
    </label>
  </div>
</div>`
}
