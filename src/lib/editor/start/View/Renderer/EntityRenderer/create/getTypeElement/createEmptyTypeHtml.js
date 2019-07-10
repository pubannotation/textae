import Handlebars from 'handlebars'
import idFactory from '../../../../../../idFactory'

// A Type element has an entity_pane elment that has a label and will have entities.
const source = `
<div id="{{id}}" class="textae-editor__type">
  <div id="P-{{id}}" class="textae-editor__entity-pane"></div>
  <div class="textae-editor__type-label" tabindex="0"></div>
  <div class="textae-editor__attribute-button textae-editor__attribute-button--add" title="Add a new attribute to this entity."></div>
</div>
`
const template = Handlebars.compile(source)

export default function(spanId, type) {
  const typeId = idFactory.makeTypeId(spanId, type)

  return template({id: typeId})
}
