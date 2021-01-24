import dohtml from 'dohtml'
import toAttribute from './toAttribute'
import toAnchorElement from './toAnchorElement'

export default function (context) {
  const { id, title, color, href, displayName, attributes } = context

  // A Type element has an entity_pane elment that has a label and will have entities.
  // jsPlumb requires the id of the DOM which is the endpoint for drawing relationships.
  // If the endpoint doesn't have an id, jsPlumb will set it,
  // and the id will be lost when redrawing the Entity's DOM.
  // To prevent this from happening, set the id of the endpoint DOM.
  const html = `
<div class="textae-editor__entity" id="${id}" title="${title}">
  <div
    class="textae-editor__entity__type-values"
    id="jsPlumb_${id}" 
    style="background-color: ${color};"
    >
    <div
      class="textae-editor__entity__type-label"
      tabindex="0"
      >
      ${toAnchorElement(href, displayName)}
    </div>
    ${attributes.map(toAttribute).join('\n')}
  </div>
</div>
`

  return dohtml.create(html)
}
