import isNodeTextBox from '../../../UseCase/EditModeSwitch/SelectionWrapper/isNodeTextBox'
import isNodeDenotationSpan from '../../../UseCase/EditModeSwitch/SelectionWrapper/isNodeDenotationSpan'
import isNodeStyleSpan from '../../../UseCase/EditModeSwitch/SelectionWrapper/isNodeStyleSpan'
import isNodeBlockSpan from '../../../UseCase/EditModeSwitch/SelectionWrapper/isNodeBlockSpan'

export default function (span, node) {
  const parent = node.parentElement
  if (isNodeTextBox(parent)) {
    return 0
  }
  if (
    isNodeDenotationSpan(parent) ||
    isNodeBlockSpan(parent) ||
    isNodeStyleSpan(parent)
  ) {
    return span.get(parent.id).begin
  }
  throw new Error(`Can not get position of a node : ${node} ${node.data}`)
}
