import destroy from '../../destroy'

// Destroy DOM elements of descendant spans.
export default function destroySpanRecurcive(span) {
  destroy(span.id)

  for (const child of span.children) {
    destroySpanRecurcive(child)
  }

}
