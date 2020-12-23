import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'

function template(context) {
  const {
    flagSelected,
    selectionSelected,
    stringSelected,
    numericSelected,
    pred,
    showDefault,
    default: _default,
    showNumeric,
    min,
    max,
    step
  } = context
  return `
<div class="textae-editor__create-attribute-definition-dialog__container">
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <label>Attribute type:</label>
    <select class="textae-editor__create-attribute-definition-dialog__value-type">
      <option value="flag"${flagSelected ? ` selected` : ``}>
        flag
        </option>
      <option value="selection"${selectionSelected ? ` selected` : ``}>
        selection
      </option>
      <option value="string"${stringSelected ? ` selected` : ``}>
        string
      </option>
      <option value="numeric"${numericSelected ? ` selected` : ``}>
        numeric
      </option>
    </select>
  </div>
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <div class="textae-editor__create-attribute-definition-dialog__pred textae-editor__promise-daialog__observable-element">
      <label>Predicate:</label><br>
      <input value="${pred || ''}">
    </div>
    ${inputDefault(showDefault, _default)}
  </div>
  ${inputNumeric(showNumeric, min, max, step)}
</div>`
}

export default class CreateAttributeDefinitionDialog extends PromiseDialog {
  constructor() {
    super('Please enter new attribute definition', template({}), {}, () => {
      const valueType = super.el.querySelector(
        '.textae-editor__create-attribute-definition-dialog__value-type'
      ).value
      const pred = getInputElementValue(
        super.el,
        '.textae-editor__create-attribute-definition-dialog__pred'
      )
      const default_ = getInputElementValue(
        super.el,
        '.textae-editor__create-attribute-definition-dialog__default'
      )
      const min = getInputElementValue(
        super.el,
        '.textae-editor__create-attribute-definition-dialog__min'
      )
      const max = getInputElementValue(
        super.el,
        '.textae-editor__create-attribute-definition-dialog__max'
      )
      const step = getInputElementValue(
        super.el,
        '.textae-editor__create-attribute-definition-dialog__step'
      )

      // Numeric Attribute property value type must be Number type.
      if (valueType === 'numeric') {
        return {
          'value type': valueType,
          pred,
          default: parseFloat(default_),
          min: parseFloat(min),
          max: parseFloat(max),
          step: parseFloat(step)
        }
      }

      return {
        'value type': valueType,
        pred,
        default: default_,
        min,
        max,
        step
      }
    })

    delegate(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__value-type',
      'change',
      (e) => {
        const valueType = e.target.value

        const pred = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__pred'
        )
        const default_ = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__default'
        )
        const min = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__min'
        )
        const max = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__max'
        )
        const step = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__step'
        )

        const state = {
          pred,
          default: default_,
          min,
          max,
          step,
          showDefault: valueType === 'numeric' || valueType === 'string',
          showNumeric: valueType === 'numeric'
        }
        state[`${valueType}Selected`] = true

        const html = template(state)
        super.el.closest('.ui-dialog-content').innerHTML = html
      }
    )
  }
}
function inputNumeric(showNumeric, min, max, step) {
  return showNumeric
    ? `
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <div class="textae-editor__create-attribute-definition-dialog__min">
      <label>Min:</label><br>
      <input type="text" value="${min || ''}">
    </div>
    <div class="textae-editor__create-attribute-definition-dialog__max">
      <label>Max:</label><br>
      <input type="text" value="${max || ''}">
    </div>
    <div class="textae-editor__create-attribute-definition-dialog__step">
      <label>Step:</label><br>
      <input type="text" value="${step || ''}">
    </div>
  </div>
`
    : ``
}

function inputDefault(showDefault, _default) {
  return showDefault
    ? `
    <div class="textae-editor__create-attribute-definition-dialog__default">
      <label>Default:</label><br>
      <input value="${_default || ''}">
    </div>
`
    : ``
}
