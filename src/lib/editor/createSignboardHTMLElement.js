import dohtml from 'dohtml'

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
    ${model.typeValues.attributes.map((a) => a.contentHTML).join('\n')}
  </div>
</div>
`

  return dohtml.create(html)
}

function hexToRGBA(hex, alpha) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  console.assert(result, `${hex} is not a hexadecimal color values!`)

  return `rgba(${parseInt(result[1], 16)}, ${parseInt(
    result[2],
    16
  )}, ${parseInt(result[3], 16)}, ${alpha})`
}
