import inputDefault from '../inputDefault'
import inputNumeric from '../inputNumeric'

export default function (context) {
  const { pred, default: _default, min, max, step, valueType } = context

  const showDefault = valueType === 'numeric' || valueType === 'string'
  const showNumeric = valueType === 'numeric'

  return `
<div class="textae-editor__edit-attribute-definition-dialog__container">
  <div class="textae-editor__edit-attribute-definition-dialog__row">
    <div class="textae-editor__edit-attribute-definition-dialog__pred textae-editor__promise-daialog__observable-element">
      <label>Predicate:</label><br>
      <input value="${pred}">
    </div>
    ${
      showDefault
        ? `${inputDefault(
            'textae-editor__edit-attribute-definition-dialog',
            _default
          )}`
        : ''
    }
  </div>
  ${
    showNumeric
      ? `${inputNumeric(
          'textae-editor__edit-attribute-definition-dialog',
          min,
          max,
          step
        )}`
      : ''
  }
</div>`
}
