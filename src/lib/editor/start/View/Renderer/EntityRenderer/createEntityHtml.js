import Handlebars from 'handlebars'

// A Type element has an entity_pane elment that has a label and will have entities.
const source = `
<div id="{{id}}" class="textae-editor__type">
  <div class="textae-editor__entity-pane">
    <div
      id="{{entityId}}" 
      title="{{entityTitle}}" 
      class="textae-editor__entity" 
      style="border-color: {{color}};"></div>
  </div>
  <div class="textae-editor__type-values" style="background-color: {{color}}">
    <div class="textae-editor__type-label" tabindex="0">
      {{#if href}}
        <a target="_blank"/ href="{{href}}">{{label}}</a>
      {{else}}
        {{label}}
      {{/if}}
    </div>
    {{#each attributes}}
    <div title="{{title}}" data-pred="{{pred}}" data-obj="{{obj}}" class="textae-editor__attribute"{{#if color}} style="background-color: {{color}}"{{/if}}>
      <span class="textae-editor__attribute-label">
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
