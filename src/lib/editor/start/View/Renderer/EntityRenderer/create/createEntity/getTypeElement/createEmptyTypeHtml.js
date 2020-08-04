import Handlebars from 'handlebars'
import '../../../registerTypeValeusPartial'

// A Type element has an entity_pane elment that has a label and will have entities.
const source = `
<div id="{{id}}" class="textae-editor__type">
  <div class="textae-editor__entity-pane"></div>
  {{>type-values}}
</div>
`
const template = Handlebars.compile(source)

export default function(entity, namespace, typeContainer) {
  return template(entity.type.toDomInfo(namespace, typeContainer))
}
