export default function(selectionModel, selection) {
  const selectedSpan = document.querySelector(
    `#${selectionModel.span.singleId}`
  )
  return selection.anchorNode.parentNode === selectedSpan
}
