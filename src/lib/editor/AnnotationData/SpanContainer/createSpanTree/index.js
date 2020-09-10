import getParent from './getParent'
import adopt from './adopt'
import spanComparator from '../spanComparator'

export default function(allSpan) {
  // Sort id of spans by the position.
  const sortedSpans = allSpan.sort(spanComparator)
  const spanTree = []

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
        } else {
          spanTree.push(span)
        }
      } else {
        spanTree.push(span)
      }
    })

  return spanTree
}
