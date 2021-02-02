import renderAllAnnotations from './renderAllAnnotations'
import SpanRenderer from './SpanRenderer'

export default function (
  annotationData,
  editor,
  relationRenderer,
  entityRenderer
) {
  const spanRenderer = new SpanRenderer(editor, entityRenderer)

  editor.eventEmitter
    .on('textae-event.annotationData.all.change', () => {
      renderAllAnnotations(editor, annotationData, spanRenderer)
      relationRenderer.reset()
    })
    .on('textae-event.annotationData.span.add', (span) =>
      spanRenderer.render(span)
    )
    .on('textae-event.annotationData.span.remove', (span) => {
      spanRenderer.remove(span)
      span.destroyGridElement()
    })
    .on('textae-event.annotationData.entity.add', (entity) => {
      entityRenderer.render(entity)
    })
    .on('textae-event.annotationData.entity.change', (entity) => {
      entityRenderer.change(entity)
    })
    .on('textae-event.annotationData.entity.remove', (entity) => {
      entityRenderer.remove(entity)
    })
    .on('textae-event.annotationData.entity.move', (entities) => {
      for (const entity of entities) {
        entityRenderer.remove(entity)
        entityRenderer.render(entity)
      }
    })
    .on('textae-event.annotationData.relation.change', (relation) => {
      relationRenderer.change(relation)
    })
    .on('textae-event.annotationData.relation.remove', (relation) => {
      relationRenderer.remove(relation)
    })
    .on('textae-event.annotationData.attribute.add', (attribute) => {
      entityRenderer.change(attribute.entity)
    })
    .on('textae-event.command.attributes.change', (attributes) => {
      for (const entity of attributes.reduce(
        (prev, curr) => prev.add(curr.entity),
        new Set()
      )) {
        entityRenderer.change(entity)
      }
    })
    .on('textae-event.annotationData.attribute.remove', (attribute) => {
      entityRenderer.change(attribute.entity)
    })
}
