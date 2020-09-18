import getParent from './getParent'
import spanComparator from '../spanComparator'

// the spanTree has parent-child structure.
// Register a typeset in the span tree to put it in the span rendering flow.
export default function(spans, spanContainer) {
  // Sort spans by the position.
  const sortedSpans = spans.sort(spanComparator)

  sortedSpans.forEach((span, index, array) => {
    span.severTies()

    const left = index !== 0 ? array[index - 1] : null
    if (left) {
      const parent = getParent(span, left)
      if (parent) {
        span.beChildOf(parent)
      } else {
        span.beChildOf(spanContainer)
      }
    } else {
      span.beChildOf(spanContainer)
    }
  })
}
