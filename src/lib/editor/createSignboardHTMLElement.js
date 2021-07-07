import dohtml from 'dohtml'
import hexToRGBA from './hexToRGBA'

export default function (model, entityType, cssClass, HTMLId) {
  // A Type element has an entity_pane elment that has a label and will have entities.
  const html = `
<div
  class="textae-editor__signboard ${cssClass ? cssClass : ''}"
  ${HTMLId ? `id="${HTMLId}"` : ''}
  title="${model.title}"
  data-entity-type="${entityType}"
  data-id="${model.id}"
  >
  <div
    class="textae-editor__signboard__type-values"
    style="background-color: ${hexToRGBA(model.color, 0.4)};"
    >
    <div
      class="textae-editor__signboard__type-label"
      tabindex="0"
      style="background-color: ${hexToRGBA(model.color, 0.6)};"
      >
      ${model.anchorHTML}
    </div>
  </div>
</div>
`

  const element = dohtml.create(html)
  const typeValues = element.querySelector(
    '.textae-editor__signboard__type-values'
  )
  for (const { HTMLElement } of model.attributes) {
    typeValues.append(HTMLElement)
  }

  return element
}
