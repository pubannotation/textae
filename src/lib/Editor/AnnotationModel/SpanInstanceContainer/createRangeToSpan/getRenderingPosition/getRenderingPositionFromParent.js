import getOffset from './getOffset'

export default function getRenderingPositionFromParent(begin, end, parent) {
  return {
    textNode: parent.element.firstChild,
    ...getOffset(begin, end, parent.begin)
  }
}
