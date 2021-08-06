import PromiseDialog from '../PromiseDialog'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

function template(context) {
  const { id, label, color, isDefault } = context
  return `
<div class="textae-editor__type-definition-dialog__container">
  <div class="textae-editor__type-definition-dialog__row ui-front">
    <label>Id</label>
    <input
      class="textae-editor__type-definition-dialog--id textae-editor__promise-daialog__observable-element" 
      value=${id || ''}>
  </div>
  <div class="textae-editor__type-definition-dialog__row ui-front">
    <label>Label<span></span></label>
    <input value="${label}">
  </div>
  <div class="textae-editor__type-definition-dialog__color-picker">
    <label><input 
      class="textae-editor__type-definition-dialog__color-picker__input" 
      type="color" 
      value="${color}">
    Color</label>
  </div>
  <div class="textae-editor__type-definition-dialog__set-default">
    <label><input 
      class="textae-editor__type-definition-dialog__set-default__input" 
      type="checkbox" ${
        isDefault ? 'checked="checked" disabled="disabled"' : ''
      }>
    Default type</label>
  </div>
</div>`
}

export default class TypeDefinitionDialog extends PromiseDialog {
  constructor(
    title,
    content,
    definitionContainer,
    autocompletionWs,
    convertToReseltsFunc
  ) {
    super(title, template(content), {}, () => {
      const inputs = super.el.querySelectorAll('input')
      return convertToReseltsFunc(
        inputs[0].value,
        inputs[1].value,
        inputs[2].value,
        inputs[3].checked
      )
    })

    setSourceOfAutoComplete(super.el, autocompletionWs, (term) =>
      definitionContainer.findByLabel(term)
    )
  }
}
