import dohtml from 'dohtml'
import toAttribute from './toAttribute'
import toAnchorElement from '../../toAnchorElement'

export default function (context) {
  const { id, title, color, href, displayName, attributes } = context

  // A Type element has an entity_pane elment that has a label and will have entities.
  const html = `
<div class="textae-editor__entity" id="${id}" title="${title}">
  <div
    class="textae-editor__entity__type-values"
    style="background-color: ${color};"
    >
    <div
      class="textae-editor__entity__type-label"
      tabindex="0"
      >
      ${toAnchorElement(displayName, href)}
    </div>
    ${attributes.map(toAttribute).join('\n')}
  </div>
</div>
`

  return dohtml.create(html)
}
