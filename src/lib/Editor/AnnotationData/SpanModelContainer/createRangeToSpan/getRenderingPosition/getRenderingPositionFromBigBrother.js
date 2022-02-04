import isBoundaryCrossing from '../../../../isBoundaryCrossing'
import getOffset from './getOffset'

export default function (span, bigBrotherSpan) {
  if (isBoundaryCrossing(span.begin, span.end, bigBrotherSpan)) {
    throw new Error(`span ${span.id} is corrisng with ${bigBrotherSpan.id}`)
  }

  let { start, end } = getOffset(span, bigBrotherSpan.end)
  let textNode = bigBrotherSpan.element.nextSibling

  // Google chrome and Safari have a 65536 character limit on the text node.
  //  A string may consist of two or more text nodes.
  // If the start position is larger than the length of the text node,
  //  the next text node is used as the range for creating a span.
  if (textNode.length < start) {
    start = start - textNode.length
    end = end - textNode.length
    textNode = textNode.nextSibling
  }

  return {
    textNode,
    start,
    end
  }
}
