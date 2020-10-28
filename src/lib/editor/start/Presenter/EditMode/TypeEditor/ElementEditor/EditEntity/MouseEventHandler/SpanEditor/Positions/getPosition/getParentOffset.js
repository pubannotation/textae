import isNodeTextBox from '../../../../../isNodeTextBox'
import isNodeDenotationSpan from '../../../../../isNodeDenotationSpan'
import isNodeStyleSpan from '../../../../../isNodeStyleSpan'

export default function(span, node) {
  const parent = node.parentElement
  if (isNodeTextBox(parent)) {
    return 0
  }
  if (isNodeDenotationSpan(parent) || isNodeStyleSpan(parent)) {
    return span.get(parent.id).begin
  }
  throw new Error(`Can not get position of a node : ${node} ${node.data}`)
}
