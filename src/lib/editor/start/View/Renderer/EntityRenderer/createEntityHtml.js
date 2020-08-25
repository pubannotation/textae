import Handlebars from 'handlebars'

// A Type element has an entity_pane elment that has a label and will have entities.
// jsPlumb requires the id of the DOM which is the endpoint for drawing relationships.
// If the endpoint doesn't have an id, jsPlumb will set it,
// and the id will be lost when redrawing the Entity's DOM.
// To prevent this from happening, set the id of the endpoint DOM.
const source = `
<div class="textae-editor__entity" id="{{entityId}}" title="{{entityTitle}}">
  <div class="textae-editor__entity__endpoint-zone">
    <div
      id="jsPlumb_{{entityId}}"
      class="textae-editor__entity__endpoint" 
      style="border-color: {{color}};"></div>
  </div>
  <div class="textae-editor__entity__type-values" style="background-color: {{color}}">
    <div class="textae-editor__entity__type-label" tabindex="0">
      {{#if href}}
        <a target="_blank"/ href="{{href}}">{{label}}</a>
      {{else}}
        {{label}}
      {{/if}}
    </div>
    {{#each attributes}}
    <div class="textae-editor__entity__attribute" title="{{title}}" data-pred="{{pred}}" data-obj="{{obj}}" {{#if color}} style="background-color: {{color}}"{{/if}}>
      <span class="textae-editor__entity__attribute-label">
        {{#if href}}
          <a target="_blank"/ href="{{href}}">{{label}}</a>
        {{else}}
          {{label}}
        {{/if}}
      </span>
    </div>
    {{/each}}
  </div>
</div>
`
export const template = Handlebars.compile(source)

export default function(entity, namespace, typeContainer) {
  const domInfo = entity.toDomInfo(namespace, typeContainer)
  return template(domInfo)
}
