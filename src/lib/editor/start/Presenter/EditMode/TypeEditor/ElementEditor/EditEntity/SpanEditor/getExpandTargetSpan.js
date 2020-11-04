export default function (selectionModel, selectionWrapper) {
  // If a span is selected, it is able to begin drag a span in the span and expand the span.
  // The focus node should be at one level above the selected node.
  if (selectionWrapper.isAnchorNodeParentIsDescendantOfSelectedSpan) {
    // cf.
    // 1. one side of a inner span is same with one side of the outside span.
    // 2. Select an outside span.
    // 3. Begin Drug from an inner span to out of an outside span.
    // Expand the selected span.
    return selectionModel.span.singleId
  } else if (selectionWrapper.isAnchorOneDownUnderFocus) {
    // To expand the span , belows are needed:
    // 1. The anchorNode is in the span.
    // 2. The foucusNode is out of the span and in the parent of the span.
    return selectionWrapper.selection.anchorNode.parentNode.id
  }
  return null
}
