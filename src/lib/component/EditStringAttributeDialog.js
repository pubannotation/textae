import PromiseDialog from './PromiseDialog'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

function template(context) {
  const { pred, value } = context

  return `
<div class="textae-editor__edit-string-attribute-dialog__container">
  <div class="textae-editor__edit-string-attribute-dialog__row">
    <label>Predicate</label>
    <input 
      value="${pred}" disabled="disabled">
  </div>
  <div class="textae-editor__edit-string-attribute-dialog__row ui-front">
    <label>Object</label>
    <input
      class="textae-editor__edit-string-attribute-dialog__value textae-editor__promise-daialog__observable-element" 
      value="${value}">
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
  constructor(attribute, attrDef, editTypeValues, pallet) {
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
      'String attribute',
      template({
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
