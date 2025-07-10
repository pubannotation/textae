import getRenderingPositionFromBigBrother from './getRenderingPositionFromBigBrother'
import getOffset from './getOffset'

export default function getRenderingPosition(
  begin,
  end,
  parent,
  bigBrotherSpan
) {
  if (bigBrotherSpan) {
    // The target text enclosed by span is in a textNode after the bigBrotherSpan
    // if bigBrotherSpan exists.
    return getRenderingPositionFromBigBrother(begin, end, bigBrotherSpan)
  } else {
    // There is no big brother if the span is first in the text.
    // The target text enclosed by span is the first child of parent
    // unless bigBrotherSpan exists.
    return {
      textNode: parent.element.firstChild,
      ...getOffset(begin, end, parent.begin)
    }
  }
}
