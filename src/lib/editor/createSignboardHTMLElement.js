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
    style="background-color: ${hexToRGBA(model.color, 0.8)};"
    >
    <div
      class="textae-editor__signboard__type-label"
      tabindex="0"
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
  for (const { contentHTML } of model.typeValues.attributes) {
    typeValues.append(dohtml.create(contentHTML))
  }

  return element
}
