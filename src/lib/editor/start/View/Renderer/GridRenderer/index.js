import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'

export default class {
  constructor(editor, gridHeight) {
    this._editor = editor
    this._container = getAnnotationBox(editor)
    this._gridHeight = gridHeight
  }

  render(span) {
    return createGrid(
      this._editor[0],
      this._container[0],
      this._gridHeight,
      span
    )
  }

  remove(span) {
    const gridElement = span.gridElement

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }
  }
}
