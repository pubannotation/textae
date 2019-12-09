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
  gridRenderer,
  entityRenderer,
  buttonStateHelper
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
    })
    .on('textae.annotationData.paragraph.change', (paragraphs) =>
      renderParagraph(editor, paragraphs)
    )
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
    .on('textae.annotationData.relation.add', (relation) => {
      relationRenderer.render(relation)
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
