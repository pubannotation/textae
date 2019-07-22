import Handlebars from 'handlebars'
import idFactory from '../../../../../../../idFactory'
import getLabel from '../../../getLabel'
import getUri from '../../../getUri'


// A Type element has an entity_pane elment that has a label and will have entities.
const source = `
<div id="{{id}}" class="textae-editor__type">
  <div class="textae-editor__type-gap"></div>
  <div id="P-{{id}}" class="textae-editor__entity-pane"></div>
  <div class="textae-editor__type-values" style="background-color: {{color}}">
    <div class="textae-editor__type-label" tabindex="0">
      {{#if href}}
        <a target="_blank"/ href="{{href}}">{{label}}</a>
      {{else}}
        {{label}}
      {{/if}}
    </div>
    {{#each attributes}}
    <div id="{{domId}}" title="{{title}}" data-pred="{{pred}}" data-obj="{{obj}}" class="textae-editor__attribute">
      <span>{{obj}}</span>
      <div class="textae-editor__attribute-buttons">
        <div class="textae-editor__attribute-button textae-editor__attribute-button--edit" title="Edit this attribute."></div>
        <div class="textae-editor__attribute-button textae-editor__attribute-button--delete" title="Delete this attribute."></div>
      </div>
    </div>
    {{/each}}
  </div>
</div>
`
const template = Handlebars.compile(source)

export default function(entity, namespace, typeDefinition) {
  const id = idFactory.makeTypeId(entity)
  const label = getLabel(namespace, typeDefinition, entity.type)
  const href = getUri(namespace, typeDefinition, entity.type)
  const color = typeDefinition.getColor(entity.type)
  const attributes = entity.attributes.map((attribute) => {
    return Object.assign({}, attribute, {
      domId: `${id}-${attribute.id}`,
      title: `pred: ${attribute.pred}, value: ${attribute.obj}`,
    })
  })

  return template({id, label, href, color, attributes})
}
