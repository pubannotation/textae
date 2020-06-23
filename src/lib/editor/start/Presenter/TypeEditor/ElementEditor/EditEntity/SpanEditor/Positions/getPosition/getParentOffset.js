import isNodeParagraph from '../../../../isNodeParagraph'
import isNodeSpan from '../../../../isNodeSpan'

export default function(span, node) {
  const parent = node.parentElement
  if (isNodeParagraph(parent)) {
    return 0
  }
  if (isNodeSpan(parent)) {
    return span.get(parent.id).begin
  }
  throw new Error(`Can not get position of a node : ${node} ${node.data}`)
}
