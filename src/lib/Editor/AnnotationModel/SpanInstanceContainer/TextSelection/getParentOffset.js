import isNodeTextBox from '../../../UseCase/EditModeFactory/SelectionWrapper/isNodeTextBox'
import isNodeDenotationSpan from '../../../UseCase/EditModeFactory/SelectionWrapper/isNodeDenotationSpan'
import isNodeStyleSpan from '../../../UseCase/EditModeFactory/SelectionWrapper/isNodeStyleSpan'
import isNodeBlockSpan from '../../../UseCase/EditModeFactory/SelectionWrapper/isNodeBlockSpan'

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
