import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'

export default class {
  constructor(editor, domPositionCache) {
    this._editor = editor
    this._domPositionCache = domPositionCache
    this._container = getAnnotationBox(editor)
  }

  render(span) {
    return createGrid(
      this._editor[0],
      this._domPositionCache,
      this._container[0],
      span.id
    )
  }

  remove(span) {
    const gridElement = span.gridElement

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }

    this._domPositionCache.removeGrid(span.id)
  }
}
