import renderParagraph from './renderParagraph'
import updateModificationButtons from './updateModificationButtons'
import renderModificationOfEntityOrRelation from './renderModificationOfEntityOrRelation'
import updateBlockStyleOfSpan from './updateBlockStyleOfSpan'
import renderAllAnnotations from './renderAllAnnotations'
import updateTextBoxHeight from '../../updateTextBoxHeight'
import setLineHeightToTypeGap from '../../setLineHeightToTypeGap'
import SpanRenderer from './SpanRenderer'

export default function(
  annotationData,
  editor,
  domPositionCache,
  relationRenderer,
  typeGap,
  debouncedUpdateAnnotationPosition,
  gridRenderer,
  entityRenderer,
  buttonStateHelper,
  annotationPosition
) {
  const spanRenderer = new SpanRenderer(annotationData, (entity) =>
    entityRenderer.render(entity)
  )

  editor.eventEmitter
    .on('textae.annotationData.all.change', () => {
      renderAllAnnotations(
        editor,
        domPositionCache,
        annotationData,
        spanRenderer,
        relationRenderer
      )
      updateTextBoxHeight(editor[0])
      setLineHeightToTypeGap(editor[0], annotationData, typeGap())
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.paragraph.change', (paragraphs) =>
      renderParagraph(editor, paragraphs)
    )
    .on('textae.annotationData.span.add', (span) => {
      spanRenderer.render(span)
      // debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.span.move', () => {
      // Move grids and relations synchronously.
      // If grid and relations move asynchronously,
      // grid positions in cache may be deleted before render relation when moving span frequently.
      // Position of relation depends on position of grid and position of grid is cached for perfermance.
      // If position of grid is not cached, relation can not be rendered.
      annotationPosition.update(typeGap())
    })
    .on('textae.annotationData.span.remove', (span) => {
      spanRenderer.remove(span)
      gridRenderer.remove(span.id)
      // debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.entity.add', (entity) => {
      // Add a now entity with a new grid after the span moved.
      updateBlockStyleOfSpan(annotationData, entity, spanRenderer)
      entityRenderer.render(entity)
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.entity.change', (entity) => {
      entityRenderer.change(entity)
      updateBlockStyleOfSpan(annotationData, entity, spanRenderer)
      gridRenderer.updateWidth(entity.span)
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.entity.remove', (entity) => {
      entityRenderer.remove(entity)
      updateBlockStyleOfSpan(annotationData, entity, spanRenderer)
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.relation.add', (relation) => {
      relationRenderer.render(relation)
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.relation.change', (relation) => {
      relationRenderer.change(relation)
    })
    .on('textae.annotationData.relation.remove', (relation) => {
      relationRenderer.remove(relation)
    })
    .on('textae.annotationData.modification.add', (modification) => {
      renderModificationOfEntityOrRelation(
        annotationData,
        modification,
        entityRenderer,
        relationRenderer
      )
      updateModificationButtons(annotationData, modification, buttonStateHelper)
    })
    .on('textae.annotationData.modification.remove', (modification) => {
      renderModificationOfEntityOrRelation(
        annotationData,
        modification,
        entityRenderer,
        relationRenderer
      )
      updateModificationButtons(annotationData, modification, buttonStateHelper)
    })
}
