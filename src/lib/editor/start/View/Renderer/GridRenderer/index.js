import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'

export default class GridRenderer {
  constructor(editor) {
    this._editor = editor
    this._container = getAnnotationBox(editor)
  }

  render(span) {
    return createGrid(this._editor, this._container, span)
  }
}
