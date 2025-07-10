import getOffset from './getOffset'

export default function getRenderingPositionFromParent(span, parent) {
  return {
    textNode: parent.element.firstChild,
    ...getOffset(span.begin, span.end, parent.begin)
  }
}
