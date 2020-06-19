import createSpanRange from './createSpanRange'
import getTextNodeFromParent from './getTextNodeFromParent'
import getTextNodeFromBigBrother from './getTextNodeFromBigBrother'

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
export default function(span, bigBrother) {
  let targetTextNode
  let startOfTextNode

  // The parent of the bigBrother is same with of span, which is a span or the root of spanTree.
  if (bigBrother) {
    // The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
    ;[targetTextNode, startOfTextNode] = getTextNodeFromBigBrother(bigBrother)
  } else {
    // The target text arrounded by span is the first child of parent unless bigBrother exists.
    ;[targetTextNode, startOfTextNode] = getTextNodeFromParent(span)
  }

  if (!targetTextNode) {
    throw new Error(`The textNode on to create a span is not found. ${span.id}`)
  }

  return createSpanRange(targetTextNode, startOfTextNode, span)
}
