import dohtml from 'dohtml'
import toAnchorElement from './toAnchorElement'

export default function (
  title,
  entityId,
  entityType,
  color,
  href,
  displayName,
  attributes,
  cssClass,
  HTMLId
) {
  // A Type element has an entity_pane elment that has a label and will have entities.
  const html = `
<div
  class="textae-editor__signboard ${cssClass ? cssClass : ''}"
  ${HTMLId ? `id="${HTMLId}"` : ''}
  title="${title}"
  data-entity-type="${entityType}"
  data-id="${entityId}"
  >
  <div
    class="textae-editor__signboard__type-values"
    style="background-color: ${color};"
    >
    <div
      class="textae-editor__signboard__type-label"
      tabindex="0"
      >
      ${toAnchorElement(displayName, href)}
    </div>
    ${attributes.map((a) => a.contentHTML).join('\n')}
  </div>
</div>
`

  return dohtml.create(html)
}
