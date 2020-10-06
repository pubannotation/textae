import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'

export default class {
  constructor(editor) {
    this._editor = editor
    this._container = getAnnotationBox(editor)
  }

  render(span) {
    return createGrid(this._editor[0], this._container[0], span.id)
  }

  remove(span) {
    const gridElement = span.gridElement

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }
  }
}
