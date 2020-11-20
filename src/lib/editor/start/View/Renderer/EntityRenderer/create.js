import dohtml from 'dohtml'
import createEntityHtml from './createEntityHtml'

// An entity is a circle on Type that is an endpoint of a relation.
// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.
export default function (typeContainer, gridRenderer, entity, namespace) {
  // Don't delete child Span on span moves.
  // Check if a child span is already present so that it is not drawn twice.
  if (entity.element) {
    return
  }

  const grid = entity.span.gridElement || gridRenderer.render(entity.span)

  // Append a new entity to the type
  const html = createEntityHtml(entity, namespace, typeContainer)
  const element = dohtml.create(html)

  grid.insertAdjacentElement('beforeend', element)
}
