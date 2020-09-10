import getParent from './getParent'
import spanComparator from '../spanComparator'

// the spanTree has parent-child structure.
// Register a typeset in the span tree to put it in the span rendering flow.
export default function(spans) {
  // Sort spans by the position.
  const sortedSpans = spans.sort(spanComparator)

  sortedSpans
    .map((span) =>
      Object.assign(span, {
        // Reset parent
        parent: null,
        // Reset children
        children: []
      })
    )
    .forEach((span, index, array) => {
      const left = index !== 0 ? array[index - 1] : null

      if (left) {
        const parent = getParent(span, left)
        if (parent) {
          parent.children.push(span)
          span.parent = parent
        }
      }
    })
}
