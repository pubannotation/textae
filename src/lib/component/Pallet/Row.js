import Handlebars from 'handlebars'

const html = `
{{#each this}}
<tr class="textae-editor__type-pallet__entity-type" style="background-color: {{color}};">
  <td>
    <input class="textae-editor__type-pallet__entity-type__radio" type="radio" name="etype" id="{{id}}" {{#if defaultType}}title="default type" checked="checked"{{/if}}>
  </td>
  <td class="textae-editor__type-pallet__entity-type__label" id="{{id}}">
    <span title={{id}}>
      {{id}}
    </span>
  </td>
  <td>
    {{label}}
  </td>
  <td>
    {{#if uri}}
    <a href="{{uri}}" target="_blank"><span class="textae-editor__type-pallet__link"></span></a>
    {{/if}}
  </td>
</tr>
{{/each}}
`

let tepmlate = Handlebars.compile(html)

export default function(typeContainer) {
  let types = typeContainer
    .getSortedIds()
    .map(id => {
      return {
        id,
        label: typeContainer.getLabel(id),
        defaultType: id === typeContainer.getDefaultType(),
        uri: typeContainer.getUri(id),
        color: typeContainer.getColor(id)
      }
    })

  return $(tepmlate(types))
}
