import Handlebars from 'handlebars'

Handlebars.registerPartial(
  'type-values',
  `
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
  `
)
