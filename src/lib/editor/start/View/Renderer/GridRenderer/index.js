import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'
import adaptWidthToSpan from './adaptWidthToSpan'
import getGridElement from './getGridElement'

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
    const gridElement = getGridElement(span.id)

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }

    this._domPositionCache.removeGrid(span.id)
  }

  updateWidth(span) {
    const gridElement = getGridElement(span.id)
    adaptWidthToSpan(gridElement, this._domPositionCache, span.id)
  }
}
