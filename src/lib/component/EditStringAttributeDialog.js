import PromiseDialog from './PromiseDialog'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

function template(context) {
  const { pred, value } = context

  return `
<div class="textae-editor__edit-value-and-pred-dialog__container">
  <div class="textae-editor__edit-value-and-pred-dialog__input-box">
    <label>Predicate:</label><br>
    <input 
      class="textae-editor__edit-value-and-pred-dialog--predicate" 
      value="${pred}" disabled="disabled">
  </div>
  <div class="textae-editor__edit-value-and-pred-dialog__input-box ui-front textae-editor__promise-daialog__observable-element">
    <label class="textae-editor__edit-value-and-pred-dialog--label">Object:</label><span></span><br>
    <input 
      class="textae-editor__edit-value-and-pred-dialog--value textae-editor__edit-value-and-pred-dialog--value" 
      value="${value}">
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
      { height: 250, buttons },
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-value-and-pred-dialog--value'
        )

        return {
          newObj: input.value,
          newLabel: super.el.querySelector('span').innerText
        }
      }
    )

    setSourceOfAutoComplete(
      super.el.querySelector(
        '.textae-editor__edit-value-and-pred-dialog--value'
      ),
      super.el.querySelector('span'),
      attrDef.autocompletionWs,
      () => []
    )
  }
}
