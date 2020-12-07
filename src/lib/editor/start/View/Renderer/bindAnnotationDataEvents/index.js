import renderAllAnnotations from './renderAllAnnotations'
import SpanRenderer from './SpanRenderer'

export default function (
  annotationData,
  editor,
  relationRenderer,
  gridRenderer,
  entityRenderer,
  textBox
) {
  const spanRenderer = new SpanRenderer(editor, entityRenderer)

  editor.eventEmitter
    .on('textae.annotationData.all.change', () => {
      textBox.render(annotationData.sourceDoc)
      renderAllAnnotations(editor, annotationData, spanRenderer)
      relationRenderer.reset()
      textBox.updateLineHeight()
    })
    .on('textae.annotationData.span.add', (span) => {
      spanRenderer.render(span)

      if (span.isBlock) {
        textBox.forceUpdate()
      }
    })
    .on('textae.annotationData.span.remove', (span) => {
      spanRenderer.remove(span)
      gridRenderer.remove(span)

      if (span.isBlock) {
        textBox.forceUpdate()
      }
    })
    .on('textae.annotationData.entity.add', (entity) => {
      entityRenderer.render(entity)
    })
    .on('textae.annotationData.entity.change', (entity) => {
      entityRenderer.change(entity)
    })
    .on('textae.annotationData.entity.remove', (entity) => {
      entityRenderer.remove(entity)
    })
    .on('textae.annotationData.entity.move', (entities) => {
      for (const entity of entities) {
        entityRenderer.remove(entity)
        entityRenderer.render(entity)
      }
    })
    .on('textae.annotationData.relation.change', (relation) => {
      relationRenderer.change(relation)
    })
    .on('textae.annotationData.relation.remove', (relation) => {
      relationRenderer.remove(relation)
    })
    .on('textae.annotationData.attribute.add', (attribute) => {
      entityRenderer.change(attribute.entity)
    })
    .on('textae.annotationData.attribute.change', (attribute) => {
      entityRenderer.change(attribute.entity)
    })
    .on('textae.annotationData.attribute.remove', (attribute) => {
      entityRenderer.change(attribute.entity)
    })
}
