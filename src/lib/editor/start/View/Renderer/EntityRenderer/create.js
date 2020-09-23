import createEntityHtml from './createEntityHtml'

// An entity is a circle on Type that is an endpoint of a relation.
// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.
export default function(typeContainer, gridRenderer, entity, namespace) {
  const grid = entity.span.gridElement || gridRenderer.render(entity.span)

  // Don't delete child Span on span moves.
  // Check if a child span is already present so that it is not drawn twice.
  if (grid.querySelector(`#${entity.entityDomId}`)) {
    return
  }

  // Append a new entity to the type
  const element = createEntityHtml(entity, namespace, typeContainer)

  grid.insertAdjacentHTML('beforeend', element)
}
