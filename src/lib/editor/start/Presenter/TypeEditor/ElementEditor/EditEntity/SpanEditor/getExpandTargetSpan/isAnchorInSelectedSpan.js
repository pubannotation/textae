export default function(selectionModel, selectionWrapper) {
  const selectedSpan =
    selectionModel.span.single && selectionModel.span.single.element
  return selectionWrapper.isAnchorNodeIn(selectedSpan)
}
