export default function(selection) {
  return (
    selection.anchorNode.parentNode.parentNode ===
    selection.focusNode.parentNode
  )
}
