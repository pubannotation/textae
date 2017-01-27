// Arrange a position of the pane to center entities when entities width is longer than pane width.
export default function(pane) {
  let paneWidth = pane.offsetWidth,
    widthOfentities = Array.prototype.map.call(
      pane.children,
      e => e.offsetWidth
    )
    .reduce((sum, width) => sum + width, 0)

  if (widthOfentities > paneWidth) {
    pane.style.left = (paneWidth - widthOfentities) / 2 + 'px'
  } else {
    pane.style.left = null
  }
}
