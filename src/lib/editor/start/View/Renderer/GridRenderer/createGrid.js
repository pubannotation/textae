import dohtml from 'dohtml'
import getRightGrid from './getRightGrid'
import createGridHtml from './createGridHtml'

export default function (editor, container, textBox, gridRectangle, span) {
  const { width, top, left } = span.isBlock
    ? gridRectangle.blockGridRectangle(textBox, span)
    : gridRectangle.denotationGridRectangle(span)

  const rightGrid = getRightGrid(editor, span.id)
  if (rightGrid) {
    // insert before the right grid.
    const html = createGridHtml(span.id, top, left, width)
    const element = dohtml.create(html)
    rightGrid.insertAdjacentElement('beforebegin', element)
    return rightGrid.previousElementSibling
  } else {
    // append to the annotation area.
    const html = createGridHtml(span.id, top, left, width)
    const element = dohtml.create(html)
    container.insertAdjacentElement('beforeend', element)
    return container.lastElementChild
  }
}
