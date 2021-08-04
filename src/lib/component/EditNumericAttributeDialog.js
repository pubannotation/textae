import delegate from 'delegate'
import PromiseDialog from './PromiseDialog'

function template(context) {
  const { pred, min, max, step, value, deletable } = context
  return `
<div class="textae-editor__edit-value-and-pred-dialog__container">
  <div class="textae-editor__edit-value-and-pred-dialog__input-box">
    <label>Predicate</label>
    <input 
      value="${pred}" 
      disabled="disabled">
  </div>
  <div class="textae-editor__edit-value-and-pred-dialog__input-box ui-front">
    <label>
      <input 
        class="textae-editor__edit-value-and-pred-dialog__value textae-editor__promise-daialog__observable-element" 
        type="number" 
        min="${min}" 
        max="${max}" 
        step="${step}" 
        value="${value}">
      Object
    </label>
  </div>
  ${
    deletable
      ? `
      <div class="textae-editor__edit-value-and-pred-dialog__input-box">
        <button
          type="button" 
          class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__remove__value" 
          >
        </button>
      </div>
      `
      : ''
  }
</div>`
}

export default class EditNumericAttributeDialog extends PromiseDialog {
  constructor(attrDef, attribute, deletable, editTypeValues, pallet) {
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

    const buttons = [
      {
        text: 'OK',
        click: () => this.close()
      }
    ]

    if (editTypeValues) {
      buttons.unshift({
        text: 'Change label',
        click: () => {
          this.close()
          editTypeValues()
        }
      })
    }

    if (pallet) {
      buttons.unshift({
        text: 'Show label list editor',
        click: () => {
          this.close()
          pallet.show()
        }
      })
    }

    super(
      'Numeric attibute',
      template({
        pred: attribute.pred,
        value: attribute.obj,
        min: attrDef.min,
        max: attrDef.max,
        step: attrDef.step,
        deletable
      }),
      { buttons },
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-value-and-pred-dialog__value'
        )

        // Numeric attribute obj value type must be Number type.
        return { newObj: input.value }
      },
      deletable ? bind : null
    )
  }
}
