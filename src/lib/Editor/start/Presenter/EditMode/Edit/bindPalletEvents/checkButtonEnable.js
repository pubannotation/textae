export default function (targetNode) {
  return !targetNode.classList.contains(
    'textae-editor__pallet__table-button--disabled'
  )
}
