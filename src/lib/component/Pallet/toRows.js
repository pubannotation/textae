import Handlebars from 'handlebars'

const html = `
<tr>
  <th>default</th>
  <th>id</th>
  <th>label</th>
  <th>color</th>
  <th>#</th>
  <th>edit</th>
  <th>remove</th>
</tr>
{{#each this}}
<tr class="textae-editor__type-pallet__row" style="background-color: {{color}};">
  <td>
    <input class="textae-editor__type-pallet__radio" type="radio" name="etype" id="{{id}}" {{#if defaultType}}title="default type" checked="checked"{{/if}}>
  </td>
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
  <td>
    <button class="textae-editor__type-pallet__edit-type" type="button" title="Edit this type."  data-id="{{id}}"></button>
  </td>
  <td>
    {{#unless useNumber}}
    <button class="textae-editor__type-pallet__remove" type="button"
      title="Remove this type." data-id="{{id}}" data-short-label="{{label}}"></button>
    {{/unless}}
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
