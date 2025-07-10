import getOffset from './getOffset'

export default function getRenderingPositionFromParent(span, parent) {
  const { start, end } = getOffset(span.begin, span.end, parent.begin)

  return {
    textNode: parent.element.firstChild,
    start,
    end
  }
}
