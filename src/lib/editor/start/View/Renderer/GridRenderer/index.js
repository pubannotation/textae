import getAnnotationBox from '../getAnnotationBox'

export default class GridRenderer {
  constructor(editor) {
    this._editor = editor
    this._container = getAnnotationBox(editor)
  }

  render(span) {
    return span.createGrid()
  }
}
