import Handlebars from 'handlebars'

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
      <span class="textae-editor__attribute-label">{{obj}}</span>
    </div>
    {{/each}}
  </div>
</div>
`
const template = Handlebars.compile(source)

export default function(entity, namespace, typeContainer) {
  return template(entity.type.toDomInfo(namespace, typeContainer))
}
