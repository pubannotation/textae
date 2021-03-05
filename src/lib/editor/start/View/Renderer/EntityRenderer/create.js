// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.
export default function (entity, namespace) {
  // Don't delete child Span on span moves.
  // Check if a child span is already present so that it is not drawn twice.
  if (entity.element) {
    return
  }

  const grid = entity.span.gridElement || entity.span.renderGridElement()

  // Append a new entity to the type
  const element = entity.renderElement(namespace)
  grid.insertAdjacentElement('beforeend', element)
}
