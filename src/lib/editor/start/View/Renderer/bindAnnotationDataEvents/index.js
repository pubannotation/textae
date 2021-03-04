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
    .on('textae-event.annotation-data.all.change', () => {
      renderAllAnnotations(editor, annotationData, spanRenderer)
      for (const relation of annotationData.relation.all) {
        relationRenderer.render(relation)
      }
    })
    .on('textae-event.annotation-data.span.add', (span) =>
      spanRenderer.render(span)
    )
    .on('textae-event.annotation-data.span.remove', (span) => {
      spanRenderer.remove(span)
      span.destroyGridElement()
    })
    .on('textae-event.annotation-data.entity.add', (entity) => {
      entityRenderer.render(entity)
    })
    .on('textae-event.annotation-data.entity.change', (entity) => {
      entityRenderer.change(entity)
    })
    .on('textae-event.annotation-data.entity.remove', (entity) => {
      entityRenderer.remove(entity)
    })
    .on('textae-event.annotation-data.entity.move', (entities) => {
      for (const entity of entities) {
        entityRenderer.remove(entity)
        entityRenderer.render(entity)
      }
    })
    .on('textae-event.annotation-data.relation.add', (relation) => {
      relationRenderer.render(relation)
    })
    .on('textae-event.annotation-data.relation.change', (relation) => {
      relationRenderer.change(relation)
    })
    .on('textae-event.annotation-data.relation.remove', (relation) => {
      relationRenderer.remove(relation)
    })
    .on('textae-event.annotation-data.attribute.add', (attribute) => {
      entityRenderer.change(attribute.entity)
    })
    .on('textae-event.commander.attributes.change', (attributes) => {
      for (const entity of attributes.reduce(
        (prev, curr) => prev.add(curr.entity),
        new Set()
      )) {
        entityRenderer.change(entity)
      }
    })
    .on('textae-event.annotation-data.attribute.remove', (attribute) => {
      entityRenderer.change(attribute.entity)
    })
}
