import getParent from './getParent'
import spanComparator from '../spanComparator'

// the spanTree has parent-child structure.
export default function (root, spans) {
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
        span.beChildOf(root)
      }
    } else {
      span.beChildOf(root)
    }
  })
}
