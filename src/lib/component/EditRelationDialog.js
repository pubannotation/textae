import PromiseDialog from './PromiseDialog'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

function template(context) {
  const { label, value } = context
  return `
<div class="textae-editor__edit-value-and-pred-dialog__container">
  <div class="textae-editor__edit-value-and-pred-dialog__input-box">
    <label>Predicate:</label><br>
    <input 
      class="textae-editor__edit-value-and-pred-dialog--predicate" 
      value="type" 
      disabled="disabled">
  </div>
  <div class="textae-editor__edit-value-and-pred-dialog__input-box ui-front">
    <label class="textae-editor__edit-value-and-pred-dialog--label">Value:<span>${
      label || ''
    }</span></label><br>
    <input 
      class="textae-editor__edit-value-and-pred-dialog--value textae-editor__promise-daialog__observable-element" 
      value="${value}">
  </div>
</div>`
}

export default class EditRelationDialog extends PromiseDialog {
  constructor(typeName, definitionContainer, autocompletionWs) {
    super(
      'Please enter new values',
      template({
        value: typeName,
        label: definitionContainer.getLabel(typeName)
      }),
      {
        height: 250
      },
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-value-and-pred-dialog--value'
        )
        const label = super.el.querySelector('span')

        return { typeName: input.value, label: label.innerText }
      }
    )

    // Update the source
    const value = super.el.querySelector(
      '.textae-editor__edit-value-and-pred-dialog--value'
    )
    const labelSpan = super.el.querySelector(
      '.textae-editor__edit-value-and-pred-dialog--label span'
    )
    setSourceOfAutoComplete(value, labelSpan, autocompletionWs, (term) =>
      definitionContainer.findByLabel(term)
    )
  }
}
