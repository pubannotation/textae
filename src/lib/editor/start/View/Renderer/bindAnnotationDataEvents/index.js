import renderText from './renderText'
import updateBlockStyleOfSpan from './updateBlockStyleOfSpan'
import renderAllAnnotations from './renderAllAnnotations'
import setLineHeightToTypeGap from '../../setLineHeightToTypeGap'
import SpanRenderer from './SpanRenderer'

export default function(
  annotationData,
  editor,
  domPositionCache,
  relationRenderer,
  typeGap,
  gridRenderer,
  entityRenderer
) {
  const spanRenderer = new SpanRenderer(editor, annotationData, (entity) =>
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
      setLineHeightToTypeGap(editor[0], annotationData, typeGap())
    })
    .on('textae.annotationData.span.add', (span) => {
      spanRenderer.render(span)
    })
    .on('textae.annotationData.span.remove', (span) => {
      spanRenderer.remove(span)
      gridRenderer.remove(span.id)
    })
    .on('textae.annotationData.entity.add', (entity) => {
      // Add a now entity with a new grid after the span moved.
      updateBlockStyleOfSpan(annotationData, entity, spanRenderer)
      entityRenderer.render(entity)
    })
    .on('textae.annotationData.entity.change', (entity) => {
      entityRenderer.change(entity)
      updateBlockStyleOfSpan(annotationData, entity, spanRenderer)
      gridRenderer.updateWidth(entity.span)
    })
    .on('textae.annotationData.entity.remove', (entity) => {
      entityRenderer.remove(entity)
      updateBlockStyleOfSpan(annotationData, entity, spanRenderer)
    })
    .on('textae.annotationData.entity.move', (entities) => {
      for (const entity of entities) {
        entityRenderer.remove(entity)
        updateBlockStyleOfSpan(annotationData, entity, spanRenderer)
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
