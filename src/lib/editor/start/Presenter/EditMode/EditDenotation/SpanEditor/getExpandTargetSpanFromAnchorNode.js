export default function (selectionWrapper) {
  if (
    selectionWrapper.parentOfFocusNode.contains(
      selectionWrapper.parentOfAnchorNode
    )
  ) {
    // To expand the span , belows are needed:
    // 1. The anchorNode is in the span.
    // 2. The foucusNode is out of the span and in the parent of the span.
    return selectionWrapper.parentOfAnchorNode.id
  }
  return null
}
