import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'

export default class {
  constructor(editor, spanPositionCache) {
    this._editor = editor
    this._spanPositionCache = spanPositionCache
    this._container = getAnnotationBox(editor)
  }

  render(span) {
    return createGrid(
      this._editor[0],
      this._spanPositionCache,
      this._container[0],
      span.id
    )
  }

  remove(span) {
    const gridElement = span.gridElement

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }
  }
}
