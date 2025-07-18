import getRenderingPositionFromBigBrother from './getRenderingPositionFromBigBrother'
import getOffset from './getOffset'

export default function getRenderingPosition(
  begin,
  end,
  parent,
  bigBrotherSpan
) {
  let ret

  if (bigBrotherSpan) {
    // The target text enclosed by span is in a textNode after the bigBrotherSpan
    // if bigBrotherSpan exists.
    ret = getRenderingPositionFromBigBrother(begin, end, bigBrotherSpan)
  } else {
    // There is no big brother if the span is first in the text.
    // The target text enclosed by span is the first child of parent
    // unless bigBrotherSpan exists.
    ret = {
      textNode: parent.element.firstChild,
      ...getOffset(begin, end, parent.begin)
    }
  }

  if (!ret.textNode) {
    throw new Error(
      `The textNode on to create a span ${begin}:${end} is not found.`
    )
  }

  if (ret.start < 0) {
    throw new Error(
      `start must be positive, but ${ret.start} for ${begin}:${end}.`
    )
  }

  return ret
}
