import getRightGrid from './getRightGrid'
import createGridHtml from './createGridHtml'
import getPosition from '../../getPosition'

export default function(editorDom, container, spanId) {
  const { width } = getPosition(editorDom.querySelector(`#${spanId}`))
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
