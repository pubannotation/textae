import Handlebars from 'handlebars'

const html = `
<tr>
  <th>id</th>
  <th>label</th>
  <th title="Number of annotations.">#</th>
  <th></th>
</tr>
{{#if this}}
{{#each this}}
<tr class="textae-editor__type-pallet__row" style="background-color: {{color}};">
  <td class="textae-editor__type-pallet__label" id="{{id}}">
    <span title={{id}}>
      {{id}}
    </span>
    {{#if uri}}
      <a href="{{uri}}" target="_blank"><span class="textae-editor__type-pallet__link"></span></a>
    {{/if}}
    {{#if defaultType}}
      <span class="textae-editor__type-pallet__default-icon" title="This type is set as a default type."></span>
    {{/if}}
  </td>
  <td class="textae-editor__type-pallet__short-label">
    {{label}}
  </td>
  <td class="textae-editor__type-pallet__use-number">
    {{#if useNumber}}{{useNumber}}{{/if}}
    {{#unless useNumber}}0{{/unless}}
  </td>
  <td class="textae-editor__type-pallet__table-buttons">
    <button
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__select-all {{#unless useNumber}}textae-editor__type-pallet__table-button--disabled{{/unless}}"
      title="Select all the cases of this type."
      data-id="{{id}}"
      data-use-number="{{useNumber}}">
    </button>
    <button
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-type textae-editor__type-pallet__hide-when-locked"
      title="Edit this type." data-id="{{id}}"
      data-color="{{color}}"
      data-is-default="{{defaultType}}">
    </button>
    <button 
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__remove textae-editor__type-pallet__hide-when-locked {{#if useNumber}}textae-editor__type-pallet__table-button--disabled{{/if}}"
      title="{{#if useNumber}}To activate this button, remove all the annotations of this type.{{/if}}{{#unless useNumber}}Remove this type.{{/unless}}"
      data-id="{{id}}"
      data-short-label="{{label}}">
      </button>
  </td>
</tr>
{{/each}}
{{/if}}
{{#unless this}}
<tr class="textae-editor__type-pallet__row">
  <td class="textae-editor__type-pallet__no-config" colspan="4"></td>
</tr>
{{/unless}}
`

const template = Handlebars.compile(html)

export default function(pallet, typeContainer) {
  pallet.querySelector('table').innerHTML = template(typeContainer.pallet)
}
