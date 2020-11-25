import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'

export default class GridRenderer {
  constructor(editor, textBox, gridRectangle) {
    this._editor = editor
    this._container = getAnnotationBox(editor)
    this._gridRectangle = gridRectangle
    this._textBox = textBox
  }

  render(span) {
    return createGrid(
      this._editor,
      this._container,
      this._textBox,
      this._gridRectangle,
      span
    )
  }

  remove(span) {
    span.destroyGridElement()
  }
}
