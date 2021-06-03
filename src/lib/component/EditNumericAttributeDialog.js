import delegate from 'delegate'
import PromiseDialog from './PromiseDialog'

function template(context) {
  const { pred, min, max, step, value, deletable } = context
  return `
<div class="textae-editor__edit-value-and-pred-dialog__container">
  <div class="textae-editor__edit-value-and-pred-dialog__input-box">
    <label>Predicate:</label><br>
    <input 
      class="textae-editor__edit-value-and-pred-dialog--predicate" 
      value="${pred}" 
      disabled="disabled">
  </div>
  <div class="textae-editor__edit-value-and-pred-dialog__input-box ui-front">
    <label class="textae-editor__edit-value-and-pred-dialog--label">Object:</label><br>
    <input 
      class="textae-editor__edit-value-and-pred-dialog--value textae-editor__promise-daialog__observable-element" 
      type="number" 
      min="${min}" 
      max="${max}" 
      step="${step}" 
      value="${value}">
  </div>
  ${
    deletable
      ? `
      <button
        type="button" 
        class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__remove__value" 
        >
      </button>
      `
      : ''
  }
</div>`
}

export default class EditNumericAttributeDialog extends PromiseDialog {
  constructor(attrDef, attribute, deletable) {
    const bind = (dialog, resolve) => {
      delegate(
        dialog.el,
        '.textae-editor__edit-type-dialog__attribute__remove__value',
        'click',
        () => {
          dialog.close()
          resolve({ newObj: null })
        }
      )
    }

    super(
      'Please edit number',
      template({
        pred: attribute.pred,
        value: attribute.obj,
        min: attrDef.min,
        max: attrDef.max,
        step: attrDef.step,
        deletable
      }),
      {},
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-value-and-pred-dialog--value'
        )

        // Numeric attribute obj value type must be Number type.
        return { newObj: input.value }
      },
      deletable ? bind : null
    )
  }
}
