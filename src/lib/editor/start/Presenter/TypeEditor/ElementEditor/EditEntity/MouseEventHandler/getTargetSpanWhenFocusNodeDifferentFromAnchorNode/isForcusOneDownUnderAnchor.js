export default function(selection) {
  return (
    selection.anchorNode.parentNode ===
    selection.focusNode.parentNode.parentNode
  )
}
