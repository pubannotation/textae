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
  </div>
</div>
`
const template = Handlebars.compile(source)

export default function(spanId, namespace, typeDefinition, type) {
  const id = idFactory.makeTypeId(spanId, type)
  const label = getLabel(namespace, typeDefinition, type)
  const href = getUri(namespace, typeDefinition, type)
  const color = typeDefinition.getColor(type)

  return template({id, label, href, color})
}
