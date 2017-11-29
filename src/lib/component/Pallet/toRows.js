import Handlebars from 'handlebars'

const html = `
<tr>
  <th>id</th>
  <th>label</th>
  <th>#</th>
  <th class="textae-editor__type-pallet__hide-when-locked"></th>
</tr>
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
  <td class="textae-editor__type-pallet__table-buttons textae-editor__type-pallet__hide-when-locked">
    <button class="textae-editor__type-pallet__table-button textae-editor__type-pallet__select-all
      {{#unless useNumber}}textae-editor__type-pallet__table-button--disabled{{/unless}}"
      type="button" title="Select all the cases of this type." data-id="{{id}}" data-use-number="{{useNumber}}"></button>
    <button class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-type" type="button"
      title="Edit this type." data-id="{{id}}" data-color="{{color}}" data-is-default="{{defaultType}}"></button>
    <button class="textae-editor__type-pallet__table-button textae-editor__type-pallet__remove
      {{#if useNumber}}textae-editor__type-pallet__table-button--disabled{{/if}}"
      type="button" title="Remove this type." data-id="{{id}}" data-short-label="{{label}}"></button>
  </td>
</tr>
{{/each}}
`

let tepmlate = Handlebars.compile(html)

export default function(typeContainer) {
  let labelUseCountMap = typeContainer.countTypeUse(),
    types = typeContainer
    .getSortedIds()
    .map(id => {
      return {
        id,
        label: typeContainer.getLabel(id),
        defaultType: id === typeContainer.getDefaultType(),
        uri: typeContainer.getUri(id),
        color: typeContainer.getColor(id),
        useNumber: labelUseCountMap.get(id)
      }
    })

  return tepmlate(types)
}
