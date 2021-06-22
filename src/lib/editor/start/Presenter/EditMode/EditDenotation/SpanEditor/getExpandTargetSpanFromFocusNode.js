export default function (selectionModel, selectionWrapper) {
  if (selectionWrapper.isFocusNodeParentIsDescendantOfSelectedSpan) {
    return selectionModel.span.singleId
  } else if (selectionWrapper.isFocusOneDownUnderFocus) {
    return selectionWrapper.selection.focusNode.parentNode.id
  }
  return null
}
