export default function (selectionWrapper) {
  if (
    selectionWrapper.parentOfAnchorNode.contains(
      selectionWrapper.parentOfFocusNode
    )
  ) {
    return selectionWrapper.selection.focusNode.parentNode.id
  }
  return null
}
