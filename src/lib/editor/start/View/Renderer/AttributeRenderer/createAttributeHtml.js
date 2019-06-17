import Handlebars from 'handlebars'

const source = `
<div id="{{id}}" title="{{title}}" origin-id="{{originId}}" type="{{value}}" pred="{{pred}}" class="textae-editor__attribute">
  <span>{{value}}</span>
  <div class="textae-editor__attribute-buttons">
    <div class="textae-editor__attribute-button textae-editor__attribute-button--edit" title="Edit this attribute."></div>
    <div class="textae-editor__attribute-button textae-editor__attribute-button--delete" title="Delete this attribute."></div>
  </div>
</div>
`
const template = Handlebars.compile(source)

export default function(id, attribute) {
  return template({
    id,
    title: `id: ${attribute.id}, pred: ${attribute.pred}, value: ${attribute.value}`,
    originId: attribute.id,
    value: attribute.value,
    pred: attribute.pred
  })
}
