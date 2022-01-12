import delegate from 'delegate'
import PromiseDialog from './PromiseDialog'

function template(context) {
  const { subjects, pred, min, max, step, value } = context
  return `
<div class="textae-editor__edit-numeric-attribute-dialog__container">
  <div class="textae-editor__edit-numeric-attribute-dialog__row">
    <label>Subject</label>
    <div class="textae-editor__edit-numeric-attribute-dialog__subject-row">
      <input 
      class="textae-editor__edit-numeric-attribute-dialog__subject-input"
        value="${subjects}" 
        disabled="disabled">
      <button 
        class="textae-editor__edit-numeric-attribute-dialog__subject-edit-button"
        title="properties">...</button>
    </div>
  </div>
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
      ${typeof min === 'number' ? `min="${min}"` : ''}
      ${typeof max === 'number' ? `max="${max}"` : ''}
      step="${step}" 
      value="${value}"
      autofocus>
  </div>
</div>`
}

export default class EditNumericAttributeDialog extends PromiseDialog {
  constructor(
    attrDef,
    attribute,
    targetAttributes,
    deletable,
    editTypeValues,
    pallet
  ) {
    const buttons = []

    if (deletable) {
      buttons.unshift({
        class: 'textae-editor__edit-numeric-attribute-dialog__remove-attribute',
        click: () => {
          this.close()
          this.resolveFunc({ newObj: null })
        }
      })
    }

    if (pallet) {
      buttons.unshift({
        text: '...',
        title: 'cofiguration',
        click: () => {
          this.close()
          pallet.show()
          pallet.showAttribute(attribute.pred)
        }
      })
    }

    super(
      `Attribute [${targetAttributes.map(({ id }) => id || '-').join(',')}]`,
      template({
        subjects: `${targetAttributes
          .map(({ subj }) => subj || '-')
          .join(', ')}`,
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

    if (editTypeValues) {
      delegate(
        super.el,
        '.textae-editor__edit-numeric-attribute-dialog__subject-edit-button',
        'click',
        () => {
          this.close()
          editTypeValues()
        }
      )
    }
  }
}
