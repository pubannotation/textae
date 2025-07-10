import getOffset from './getOffset'

export default function getRenderingPositionFromParent(span) {
  const { start, end } = getOffset(span.begin, span.end, span.parent.begin)

  return {
    textNode: span.parent.element.firstChild,
    start,
    end
  }
}
