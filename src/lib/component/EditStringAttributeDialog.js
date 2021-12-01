import delegate from 'delegate'
import PromiseDialog from './PromiseDialog'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

function template(context) {
  const { subjects, pred, value } = context

  return `
<div class="textae-editor__edit-string-attribute-dialog__container">
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
  <div class="textae-editor__edit-string-attribute-dialog__row">
    <label>Predicate</label>
    <input 
      value="${pred}" disabled="disabled">
  </div>
  <div class="textae-editor__edit-string-attribute-dialog__row ui-front">
    <label>Object</label>
    <input
      class="textae-editor__edit-string-attribute-dialog__value textae-editor__promise-daialog__observable-element" 
      value="${value}"
      autofocus>
  </div>
  <div class="textae-editor__edit-string-attribute-dialog__row">
    <label>Label</label>
    <input 
      class="textae-editor__edit-string-attribute-dialog__label" 
      value="" disabled="disabled">
  </div>
</div>`
}

export default class EditStringAttributeDialog extends PromiseDialog {
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
        class: 'textae-editor__edit-string-attribute-dialog__remove-attribute',
        click: () => {
          this.close()
          this.resolveFunc({ newObj: null })
        }
      })
    }

    if (pallet) {
      buttons.unshift({
        text: '...',
        title: 'configuration',
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
        value: attribute.obj
      }),
      { buttons },
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-string-attribute-dialog__value'
        )

        return {
          newObj: input.value,
          newLabel: super.el.querySelector(
            '.textae-editor__edit-string-attribute-dialog__label'
          ).value
        }
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

    setSourceOfAutoComplete(
      super.el.querySelector(
        '.textae-editor__edit-string-attribute-dialog__value'
      ),
      super.el.querySelector(
        '.textae-editor__edit-string-attribute-dialog__label'
      ),
      attrDef.autocompletionWs,
      () => []
    )
  }
}
