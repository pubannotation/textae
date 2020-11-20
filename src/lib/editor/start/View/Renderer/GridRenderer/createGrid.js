import getRightGrid from './getRightGrid'

export default function (editor, container, textBox, gridRectangle, span) {
  const { width, top, left } = span.isBlock
    ? gridRectangle.blockGridRectangle(textBox, span)
    : gridRectangle.denotationGridRectangle(span)

  const rightGrid = getRightGrid(editor, span.id)
  if (rightGrid) {
    // insert before the right grid.
    rightGrid.insertAdjacentElement(
      'beforebegin',
      span.renderGridElement(top, left, width)
    )
    return rightGrid.previousElementSibling
  } else {
    // append to the annotation area.
    container.insertAdjacentElement(
      'beforeend',
      span.renderGridElement(top, left, width)
    )
    return container.lastElementChild
  }
}
