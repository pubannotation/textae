export default function (selectionModel, selectionWrapper) {
  if (selectionWrapper.isFocusNodeParentIsDescendantOfSelectedSpan) {
    return selectionModel.span.singleId
  } else if (
    selectionWrapper.parentOfAnchorNode.contains(
      selectionWrapper.parentOfFocusNode
    )
  ) {
    return selectionWrapper.selection.focusNode.parentNode.id
  }
  return null
}
