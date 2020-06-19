import getRenderingPositionFromParent from './getRenderingPositionFromParent'
import getRenderingPositionFromBigBrother from './getRenderingPositionFromBigBrother'
import getBigBrother from './getBigBrother'

export default function(annotationData, span) {
  // Big Brother is a span.
  // Big Brother and Span's parent span is the same.
  // Big Brother is the Span before the span
  const bigBrother = getBigBrother(annotationData.span.topLevel(), span)

  if (bigBrother) {
    // The target text arrounded by span is in a textNode after the bigBrother
    // if bigBrother exists.
    return getRenderingPositionFromBigBrother(span, bigBrother)
  } else {
    // The target text arrounded by span is the first child of parent
    // unless bigBrother exists.
    return getRenderingPositionFromParent(span)
  }
}
