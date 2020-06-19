import getOffset from './getOffset'

export default function(span, bigBrother) {
  const { start, end } = getOffset(span, bigBrother.end)

  return {
    textNode: document.querySelector(`#${bigBrother.id}`).nextSibling,
    start,
    end
  }
}
