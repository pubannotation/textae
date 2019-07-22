import Handlebars from 'handlebars'

const source = `
<div id="{{domId}}" title="{{title}}" data-attribute-id="{{id}}" class="textae-editor__attribute">
  <span>{{value}}</span>
  <div class="textae-editor__attribute-buttons">
    <div class="textae-editor__attribute-button textae-editor__attribute-button--edit" title="Edit this attribute."></div>
    <div class="textae-editor__attribute-button textae-editor__attribute-button--delete" title="Delete this attribute."></div>
  </div>
</div>
`
const template = Handlebars.compile(source)

export default function(id, attribute) {
  return template(Object.assign({}, attribute, {
    domId: id,
    title: `pred: ${attribute.pred}, value: ${attribute.value}`
  }))
}
