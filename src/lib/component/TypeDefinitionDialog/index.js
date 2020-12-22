import PromiseDialog from '../PromiseDialog'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'
import compileHandlebarsTemplate from '../../compileHandlebarsTemplate'

const template = compileHandlebarsTemplate(`
<div class="textae-editor__edit-type-definition-dialog__container">
  <div class="textae-editor__edit-type-definition-dialog__input-box">
  <label>Id:</label><br>
  <input class="textae-editor__edit-type-definition-dialog--id textae-editor__promise-daialog__observable-element" value={{id}}>
  </div>
  <div class="textae-editor__edit-type-definition-dialog__input-box">
  <label>Label:<span></span></label><br>
  <input value="{{label}}">
  </div>
  <div class="textae-editor__edit-type-definition-dialog__color-picker">
  <label>Color:<input class="textae-editor__edit-type-definition-dialog__color-picker__input" type="color" value="{{color}}"></label>
  </div>
  <div class="textae-editor__edit-type-definition-dialog__set-default">
  <label>Default type:<input class="textae-editor__edit-type-definition-dialog__set-default__input" type="checkbox" {{#if isDefault}}checked="checked" disabled="disabled"{{/if}}></label>
  </div>
</div>`)

export default class TypeDefinitionDialog extends PromiseDialog {
  constructor(
    title,
    content,
    typeContainer,
    autocompletionWs,
    convertToReseltsFunc
  ) {
    super(
      title,
      template(content),
      {
        height: 250
      },
      '.textae-editor__promise-daialog__observable-element',
      () => {
        const inputs = super.el.querySelectorAll('input')
        return convertToReseltsFunc(
          inputs[0].value,
          inputs[1].value,
          inputs[2].value,
          inputs[3].checked
        )
      }
    )

    setSourceOfAutoComplete(super.el, autocompletionWs, (term) =>
      typeContainer.findByLabel(term)
    )
  }
}
