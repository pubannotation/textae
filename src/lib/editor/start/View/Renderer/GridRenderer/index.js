import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'

export default class {
  constructor(editor, textBox, gridRectangle) {
    this._editor = editor
    this._container = getAnnotationBox(editor)
    this._gridRectangle = gridRectangle
    this._textBox = textBox
  }

  render(span) {
    return createGrid(
      this._editor[0],
      this._container[0],
      this._textBox,
      this._gridRectangle,
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
