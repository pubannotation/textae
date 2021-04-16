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
    style="background-color: ${model.color};"
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