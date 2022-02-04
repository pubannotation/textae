import getOffset from './getOffset'

export default function (span) {
  const { start, end } = getOffset(span, span.parent.begin)

  return {
    textNode: span.parent.element.firstChild,
    start,
    end
  }
}
