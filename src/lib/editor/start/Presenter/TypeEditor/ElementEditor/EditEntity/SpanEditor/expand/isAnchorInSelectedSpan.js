export default function(selectionModel, selectionWrapper) {
  const selectedSpan = document.querySelector(
    `#${selectionModel.span.singleId}`
  )
  return selectionWrapper.isAnchorNodeIn(selectedSpan)
}
