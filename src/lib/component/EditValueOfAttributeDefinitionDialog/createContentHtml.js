import Handlebars from 'handlebars'

const source = `
<div class="textae-editor__add-value-to-attribute-dialog__container">
  <div class="textae-editor__add-value-to-attribute-dialog__row">
    <div class="textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern">
      <label>{{labelForRangeOrIdOrPattern}}:</label><br>
      <input value="{{rangeOrIdOrPattern}}">
    </div>
    {{#if showDefault}}
    <div class="textae-editor__add-value-to-attribute-dialog__default">
      <label>default:</label><br>
      <input type="checkbox" {{#if default}}checked="checked"{{/if}}>
    </div>
    {{/if}}
    <div class="textae-editor__add-value-to-attribute-dialog__label">
      <label>label:</label><br>
      <input value="{{label}}">
    </div>
    <div class="textae-editor__add-value-to-attribute-dialog__color">
      <label>color:</label><br>
      <input value="{{color}}">
    </div>
  </div>
</div>`
const template = Handlebars.compile(source)

export default function createContentHtml(conttent) {
  return template(conttent)
}
