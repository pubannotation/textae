import Handlebars from 'handlebars'

const source = `
<div id="{{domId}}" title="{{title}}" data-attribute-id="{{id}}" class="textae-editor__attribute">
  <span>{{obj}}</span>
  <div class="textae-editor__attribute-buttons">
    <div class="textae-editor__attribute-button textae-editor__attribute-button--edit" title="Edit this attribute."></div>
    <div class="textae-editor__attribute-button textae-editor__attribute-button--delete" title="Delete this attribute."></div>
  </div>
</div>
`
const template = Handlebars.compile(source)

export default function(typeDomId, attribute) {
  return template(attribute.getDataToRender(typeDomId))
}
