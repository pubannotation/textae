import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import isChanged from './isChanged'

function template(context) {
  const {
    pred,
    showDefault,
    default: _default,
    showNumeric,
    min,
    max,
    step
  } = context
  return `
<div class="textae-editor__edit-attribute-definition-dialog__container">
  <div class="textae-editor__edit-attribute-definition-dialog__row">
    <div class="textae-editor__edit-attribute-definition-dialog__pred textae-editor__promise-daialog__observable-element">
      <label>Predicate:</label><br>
      <input value="${pred}">
    </div>
    ${inputDefault(showDefault, _default)}
  </div>
  ${inputNumeric(showNumeric, min, max, step)}
</div>`
}

export default class EditAttributeDefinitionDialog extends PromiseDialog {
  constructor(attrDef) {
    const json = attrDef.JSON

    super(
      'Please enter new values',
      template({
        pred: json.pred,
        default: json.default,
        min: json.min,
        max: json.max,
        step: json.step,
        showDefault:
          attrDef.valueType === 'numeric' || attrDef.valueType === 'string',
        showNumeric: attrDef.valueType === 'numeric'
      }),
      {},
      () => {
        const pred = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__pred'
        )
        const default_ = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__default'
        )
        const min = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__min'
        )
        const max = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__max'
        )
        const step = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__step'
        )

        const diff = new Map()

        if (json.pred !== pred) {
          diff.set('pred', pred)
        }

        if (attrDef.valueType === 'string') {
          if (json.default !== default_) {
            diff.set('default', default_)
          }
        }

        if (attrDef.valueType === 'numeric') {
          if (isChanged(json.default, default_)) {
            diff.set('default', parseFloat(default_))
          }

          if (isChanged(json.min, min)) {
            diff.set('min', parseFloat(min))
          }

          if (isChanged(json.max, max)) {
            diff.set('max', parseFloat(max))
          }

          if (isChanged(json.step, step)) {
            diff.set('step', parseFloat(step))
          }
        }

        return diff
      }
    )
  }
}

function inputNumeric(showNumeric, min, max, step) {
  return showNumeric
    ? `
  <div class="textae-editor__edit-attribute-definition-dialog__row">
  <div class="textae-editor__edit-attribute-definition-dialog__min">
    <label>Min:</label><br>
    <input type="text" value="${min}">
  </div>
  <div class="textae-editor__edit-attribute-definition-dialog__max">
    <label>Max:</label><br>
    <input type="text" value="${max}">
  </div>
  <div class="textae-editor__edit-attribute-definition-dialog__step">
    <label>Step:</label><br>
    <input type="text" value="${step}">
  </div>
</div>
`
    : ''
}

function inputDefault(showDefault, _default) {
  return showDefault
    ? `
  <div class="textae-editor__edit-attribute-definition-dialog__default">
    <label>Default:</label><br>
    <input value="${_default}">
  </div>
`
    : ''
}
