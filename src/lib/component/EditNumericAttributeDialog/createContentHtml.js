import Handlebars from 'handlebars'

const source = `
<div class="textae-editor__edit-value-and-pred-dialog__container">
  <div class="textae-editor__edit-value-and-pred-dialog__input-box">
    <label>Predicate:</label><br>
    <input class="textae-editor__edit-value-and-pred-dialog--predicate" value="{{pred}}" disabled="disabled">
  </div>
  <div class="textae-editor__edit-value-and-pred-dialog__input-box ui-front">
    <label class="textae-editor__edit-value-and-pred-dialog--label">Object:</label><br>
    <input class="textae-editor__edit-value-and-pred-dialog--value" type="number" min="{{min}}" max="{{max}}" step="{{step}}" value="{{value}}">
  </div>
</div>`
const template = Handlebars.compile(source)

export default function createContentHtml(context) {
  return template(context)
}
