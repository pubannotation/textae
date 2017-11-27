import Handlebars from 'handlebars'

const html = `
<tr>
  <th>default</th>
  <th>id</th>
  <th>label</th>
  <th>use</th>
  <th>color</th>
  <th>remove</th>
</tr>
{{#each this}}
<tr class="textae-editor__type-pallet__entity-type" style="background-color: {{color}};">
  <td>
    <input class="textae-editor__type-pallet__entity-type__radio" type="radio" name="etype" id="{{id}}" {{#if defaultType}}title="default type" checked="checked"{{/if}}>
  </td>
  <td class="textae-editor__type-pallet__entity-type__label" id="{{id}}">
    <span title={{id}}>
      {{id}}
    </span>
    {{#if uri}}
      <a href="{{uri}}" target="_blank"><span class="textae-editor__type-pallet__link"></span></a>
    {{/if}}
  </td>
  <td class="textae-editor__type-pallet__entity-type__short-label">
    {{label}}
  </td>
  <td class="textae-editor__type-pallet__entity-type__use-number">
    {{#if useNumber}}
      <input class="textae-editor__type-pallet__entity-type__use-number__number" type="button" value="{{useNumber}}"
         title="Select all entities or relations of this type." data-id="{{id}}">
    {{/if}}
  </td>
  <td>
    <input class="textae-editor__type-pallet__color-picker" type="color" value="{{color}}" data-id="{{id}}">
  </td>
  <td>
    {{#unless useNumber}}
    <button class="textae-editor__type-pallet__entity-type__remove" type="button"
      title="Remove this type." data-id="{{id}}" data-short-label="{{label}}"></button>
    {{/unless}}
  </td>
</tr>
{{/each}}
<tr>
<td colspan="6">
  <input class="textae-editor__type-pallet__entity-type__add" type="button" value="add new type">
</td>
</tr>
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
