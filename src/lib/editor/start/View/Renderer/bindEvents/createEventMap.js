import renderParagraph from '../renderParagraph'
import RenderAll from '../RenderAll'

export default function(
  domPositionCache,
  entityRenderer,
  relationRenderer,
  editor,
  spanRenderer,
  gridRenderer,
  changeSpanOfEntity,
  renderModificationEntityOrRelation
) {
  const renderAll = new RenderAll(
    editor,
    domPositionCache,
    spanRenderer,
    relationRenderer
  )

  return new Map([
    ['all.change', renderAll],
    [
      'config.change',
      () => {
        entityRenderer.updateLabelAll()
        relationRenderer.changeAll()
      }
    ],
    ['paragraph.change', (paragraphs) => renderParagraph(editor, paragraphs)],
    ['span.add', (span) => spanRenderer.render(span)],
    [
      'span.remove',
      (span) => {
        spanRenderer.remove(span)
        gridRenderer.remove(span.id)
      }
    ],
    [
      'entity.add',
      (entity) => {
        // Add a now entity with a new grid after the span moved.
        changeSpanOfEntity(entity)
        entityRenderer.render(entity)
      }
    ],
    [
      'entity.change',
      (entity) => {
        entityRenderer.change(entity)
        changeSpanOfEntity(entity)
        gridRenderer.updateWidth(entity.span)
      }
    ],
    [
      'entity.remove',
      (entity) => {
        entityRenderer.remove(entity)
        changeSpanOfEntity(entity)
      }
    ],
    [
      'relation.add',
      (relation) => {
        relationRenderer.render(relation)
      }
    ],
    [
      'relation.change',
      (relation) => {
        relationRenderer.change(relation)
      }
    ],
    [
      'relation.remove',
      (relation) => {
        relationRenderer.remove(relation)
      }
    ],
    ['modification.add', renderModificationEntityOrRelation],
    ['modification.remove', renderModificationEntityOrRelation]
  ])
}
