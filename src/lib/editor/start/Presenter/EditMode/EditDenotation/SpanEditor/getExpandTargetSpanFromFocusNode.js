export default function (selectionModel, selectionWrapper) {
  if (selectionWrapper.isFocusNodeParentIsDescendantOfSelectedSpan) {
    return selectionModel.span.singleId
  } else if (selectionWrapper.isFocusOneDownUnderAnchor) {
    return selectionWrapper.selection.focusNode.parentNode.id
  }
  return null
}
