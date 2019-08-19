export default function isAnchorOneDownUnderForcus(selection) {
  return (
    selection.anchorNode.parentNode.parentNode ===
    selection.focusNode.parentNode
  )
}
