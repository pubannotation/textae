import Handlebars from 'handlebars'

const html = `
<tr>
  <th>default</th>
  <th>id</th>
  <th>label</th>
  <th>used</th>
  <th>color</th>
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
  <td class="textae-editor__type-pallet__entity-type__used-number">
    {{usedNumber}}
  </td>
  <td>
    <input class="textae-editor__type-pallet__color-picker" type="color" value="{{color}}" data-id="{{id}}">
  </td>
</tr>
{{/each}}
`

let tepmlate = Handlebars.compile(html)

export default function(typeContainer, labelUsedNumberMap) {
  let types = typeContainer
    .getSortedIds()
    .map(id => {
      return {
        id,
        label: typeContainer.getLabel(id),
        defaultType: id === typeContainer.getDefaultType(),
        uri: typeContainer.getUri(id),
        color: typeContainer.getColor(id),
        usedNumber: labelUsedNumberMap.get(id)
      }
    })

  return tepmlate(types)
}
