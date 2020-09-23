import renderText from './renderText'
import renderAllAnnotations from './renderAllAnnotations'
import SpanRenderer from './SpanRenderer'

export default function(
  annotationData,
  editor,
  domPositionCache,
  relationRenderer,
  gridRenderer,
  entityRenderer,
  textBox
) {
  const spanRenderer = new SpanRenderer((entity) =>
    entityRenderer.render(entity)
  )

  editor.eventEmitter
    .on('textae.annotationData.all.change', () => {
      renderText(editor, annotationData.sourceDoc)
      renderAllAnnotations(
        editor,
        domPositionCache,
        annotationData,
        spanRenderer,
        relationRenderer
      )
      textBox.updateLineHeight()
    })
    .on('textae.annotationData.span.add', (span) => {
      spanRenderer.render(span)
    })
    .on('textae.annotationData.span.remove', (span) => {
      spanRenderer.remove(span)
      gridRenderer.remove(span)
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
    .on('textae.annotationData.relation.add', (relation) => {
      relationRenderer.render(relation)
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
