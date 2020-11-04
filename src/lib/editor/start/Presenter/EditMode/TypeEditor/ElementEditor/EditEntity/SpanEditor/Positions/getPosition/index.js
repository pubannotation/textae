import getParentOffset from './getParentOffset'
import getOffsetFromParent from './getOffsetFromParent'

export default function (span, node) {
  return getParentOffset(span, node) + getOffsetFromParent(node)
}
