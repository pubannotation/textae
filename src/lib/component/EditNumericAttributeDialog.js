import PromiseDialog from './PromiseDialog'

function template(context) {
  const { pred, min, max, step, value } = context
  return `
<div class="textae-editor__edit-numeric-attribute-dialog__container">
  <div class="textae-editor__edit-numeric-attribute-dialog__row">
    <label>Predicate</label>
    <input 
      value="${pred}" 
      disabled="disabled">
  </div>
  <div class="textae-editor__edit-numeric-attribute-dialog__row ui-front">
    <label>Object</label>
    <input 
      class="textae-editor__edit-numeric-attribute-dialog__value textae-editor__promise-daialog__observable-element" 
      type="number" 
      min="${min}" 
      max="${max}" 
      step="${step}" 
      value="${value}">
  </div>
</div>`
}

export default class EditNumericAttributeDialog extends PromiseDialog {
  constructor(attrDef, attribute, deletable, editTypeValues, pallet) {
    const buttons = [
      {
        text: 'OK',
        click: () => this.close()
      }
    ]

    if (deletable) {
      buttons.unshift({
        class: 'textae-editor__edit-numeric-attribute-dialog__remove-attribute',
        click: () => {
          this.close()
          this.resolveFunc({ newObj: null })
        }
      })
    }

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
        step: attrDef.step
      }),
      { buttons },
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-numeric-attribute-dialog__value'
        )

        // Numeric attribute obj value type must be Number type.
        return { newObj: input.value }
      }
    )
  }
}
