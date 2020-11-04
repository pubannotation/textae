import getRightGrid from './getRightGrid'
import createGridHtml from './createGridHtml'

export default function (editorDom, container, textBox, gridRectangle, span) {
  const { width, top, left } = span.isBlock
    ? gridRectangle.blockGridRectangle(textBox, span)
    : gridRectangle.denotationGridRectangle(span)

  const rightGrid = getRightGrid(editorDom, span.id)
  if (rightGrid) {
    // insert before the right grid.
    const html = createGridHtml(span.id, top, left, width)
    rightGrid.insertAdjacentHTML('beforebegin', html)
    return rightGrid.previousElementSibling
  } else {
    // append to the annotation area.
    const html = createGridHtml(span.id, top, left, width)
    container.insertAdjacentHTML('beforeend', html)
    return container.lastElementChild
  }
}
