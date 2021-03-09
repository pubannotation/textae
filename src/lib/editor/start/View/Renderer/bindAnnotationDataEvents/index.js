import getAnnotationBox from '../../../../getAnnotationBox'
import SpanRenderer from './SpanRenderer'

export default function (annotationData, editor, entityRenderer) {
  const spanRenderer = new SpanRenderer(editor, entityRenderer)

  editor.eventEmitter
    .on('textae-event.annotation-data.all.change', () => {
      getAnnotationBox(editor).innerHTML = ''
      for (const span of annotationData.span.topLevel) {
        spanRenderer.render(span)
      }

      for (const relation of annotationData.relation.all) {
        relation.renderElement()
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
      entity.updateElement()
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
    .on('textae-event.annotation-data.attribute.add', (attribute) => {
      attribute.entity.updateElement()
    })
    .on('textae-event.commander.attributes.change', (attributes) => {
      for (const entity of attributes.reduce(
        (prev, curr) => prev.add(curr.entity),
        new Set()
      )) {
        entity.updateElement()
      }
    })
}
