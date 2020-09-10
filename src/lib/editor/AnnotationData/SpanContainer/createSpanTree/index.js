import getParent from './getParent'
import adopt from './adopt'
import spanComparator from '../spanComparator'

// the spanTree has parent-child structure.
// Register a typeset in the span tree to put it in the span rendering flow.
export default function(spans) {
  // Sort id of spans by the position.
  const sortedSpans = spans.sort(spanComparator)

  sortedSpans
    .map((span, index, array) =>
      Object.assign(span, {
        // Reset parent
        parent: null,
        // Reset children
        children: [],
        // Order by position
        left: index !== 0 ? array[index - 1] : null,
        right: index !== array.length - 1 ? array[index + 1] : null
      })
    )
    .forEach((span) => {
      if (span.left) {
        const parent = getParent(span, span.left)
        if (parent) {
          adopt(parent, span)
        }
      }
    })
}
