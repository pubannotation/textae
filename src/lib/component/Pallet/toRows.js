import Handlebars from 'handlebars'
import CLASS_NAMES from './className'

const html = `
<tr>
  <th>id</th>
  <th>label</th>
  <th title="Number of annotations.">#</th>
  <th class="${CLASS_NAMES.hideWhenLocked}"></th>
</tr>
{{#if this}}
{{#each this}}
<tr class="${CLASS_NAMES.row}" style="background-color: {{color}};">
  <td class="${CLASS_NAMES.label}" id="{{id}}">
    <span title={{id}}>
      {{id}}
    </span>
    {{#if uri}}
      <a href="{{uri}}" target="_blank"><span class="${CLASS_NAMES.link}"></span></a>
    {{/if}}
    {{#if defaultType}}
      <span class="${CLASS_NAMES.defaultIcon}" title="This type is set as a default type."></span>
    {{/if}}
  </td>
  <td class="${CLASS_NAMES.shortLabel}">
    {{label}}
  </td>
  <td class="${CLASS_NAMES.useNumber}">
    {{#if useNumber}}{{useNumber}}{{/if}}
    {{#unless useNumber}}0{{/unless}}
  </td>
  <td class="${CLASS_NAMES.tableButtons} ${CLASS_NAMES.hideWhenLocked}">
    <button class="${CLASS_NAMES.tableButton} ${CLASS_NAMES.selectAll} {{#unless useNumber}}${CLASS_NAMES.tableButtonDisabled}{{/unless}}"
      type="button" title="Select all the cases of this type." data-id="{{id}}" data-use-number="{{useNumber}}"></button>
    <button class="${CLASS_NAMES.tableButton} ${CLASS_NAMES.editType}"
      type="button" title="Edit this type." data-id="{{id}}" data-color="{{color}}" data-is-default="{{defaultType}}"></button>
    <button class="${CLASS_NAMES.tableButton} ${CLASS_NAMES.remove} {{#if useNumber}}${CLASS_NAMES.tableButtonDisabled}{{/if}}"
      type="button"
       title="{{#if useNumber}}To activate this button, remove all the annotations of this type.{{/if}}{{#unless useNumber}}Remove this type.{{/unless}}"
       data-id="{{id}}" data-short-label="{{label}}"></button>
  </td>
</tr>
{{/each}}
{{/if}}
{{#unless this}}
<tr class="${CLASS_NAMES.row}"><td class="${CLASS_NAMES.noConfig}" colspan="4"></td></tr>
{{/unless}}
`

let template = Handlebars.compile(html)

export default function(typeContainer) {
  let labelUseCountMap = typeContainer.countTypeUse(),
    types = typeContainer
    .getSortedIds()
    .map(id => {
      return {
        id,
        label: typeContainer.getLabel(id, true),
        defaultType: id === typeContainer.getDefaultType(),
        uri: typeContainer.getUri(id),
        color: typeContainer.getColor(id, true),
        useNumber: labelUseCountMap.get(id)
      }
    })

  return template(types)
}
