import Handlebars from 'handlebars';

const html = `
{{#each this}}
<tr class="textae-editor__type-pallet__entity-type" style="background-color: {{color}};">
  <td>
    <input class="textae-editor__type-pallet__entity-type__radio" type="radio" name="etype" label="{{typeName}}" {{#if defaultType}}title="default type" checked="checked"{{/if}}>
  </td>
  <td class="textae-editor__type-pallet__entity-type__label" label="{{typeName}}">
    {{typeName}}
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
    .getSortedNames()
    .map(typeName => {
      return {
        typeName: typeName,
        defaultType: typeName === typeContainer.getDefaultType(),
        uri: typeContainer.getUri(typeName),
        color: typeContainer.getColor(typeName)
      }
    })

  return $(tepmlate(types))
}
