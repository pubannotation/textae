import CLASS_NAMES from '../className'
export default function(targetNode) {
  return !targetNode.classList.contains(CLASS_NAMES.tableButtonDisabled)
}
