import getRenderingPositionFromParent from './getRenderingPositionFromParent'
import getRenderingPositionFromBigBrother from './getRenderingPositionFromBigBrother'

export default function (span) {
  const bigBrotherSpan = span.bigBrother

  if (bigBrotherSpan) {
    // The target text arrounded by span is in a textNode after the bigBrotherSpan
    // if bigBrotherSpan exists.
    return getRenderingPositionFromBigBrother(span, bigBrotherSpan)
  } else {
    // There is no big brother if the span is first in the text.
    // The target text arrounded by span is the first child of parent
    // unless bigBrotherSpan exists.
    return getRenderingPositionFromParent(span)
  }
}
