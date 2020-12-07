import getRightGrid from './getRightGrid'

export default function (editor, container, span) {
  const rightGrid = getRightGrid(editor, span.id)
  if (rightGrid) {
    // insert before the right grid.
    rightGrid.insertAdjacentElement('beforebegin', span.renderGridElement())
    return rightGrid.previousElementSibling
  } else {
    // append to the annotation area.
    container.insertAdjacentElement('beforeend', span.renderGridElement())
    return container.lastElementChild
  }
}
