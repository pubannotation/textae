import Handlebars from 'handlebars'

const source = `
<div class="textae-editor__edit-type-definition-dialog__container">
  <div class="textae-editor__edit-type-definition-dialog__input-box">
  <label>Id:</label><br>
  <input class="textae-editor__edit-type-definition-dialog--id" value={{id}}>
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
</div>`
const template = Handlebars.compile(source)

export default function(content) {
  return template(content)
}
