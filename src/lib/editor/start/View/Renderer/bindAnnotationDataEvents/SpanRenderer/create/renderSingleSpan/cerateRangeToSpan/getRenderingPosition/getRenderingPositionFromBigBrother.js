import getOffset from './getOffset'

export default function(span, bigBrotherSpan) {
  const { start, end } = getOffset(span, bigBrotherSpan.end)

  return {
    textNode: document.querySelector(`#${bigBrotherSpan.id}`).nextSibling,
    start,
    end
  }
}
