import getParentModel from './getParentModel'
import getOffsetFromParent from './getOffsetFromParent'

export default function(paragraph, span, node) {
  return getParentModel(paragraph, span, node).begin + getOffsetFromParent(node)
}
