import getRightGrid from './getRightGrid'
import createGridHtml from './createGridHtml'

export default function(editorDom, spanPositionCache, container, spanId) {
  const { width } = spanPositionCache.get(spanId)
  const rightGrid = getRightGrid(editorDom, spanId)

  if (rightGrid) {
    // insert before the right grid.
    const html = createGridHtml(spanId, width)
    rightGrid.insertAdjacentHTML('beforebegin', html)
    return rightGrid.previousElementSibling
  } else {
    // append to the annotation area.
    const html = createGridHtml(spanId, width)
    container.insertAdjacentHTML('beforeend', html)
    return container.lastElementChild
  }
}
