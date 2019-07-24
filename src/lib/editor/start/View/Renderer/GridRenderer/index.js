import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'
import adaptWidthToSpan from './adaptWidthToSpan'
import getGridElement from './getGridElement'

export default class {
  constructor(editor, domPositionCache) {
    this.editor = editor
    this.domPositionCache = domPositionCache
    this.container = getAnnotationBox(editor)
  }

  render(spanId) {
    return createGrid(
      this.editor[0],
      this.domPositionCache,
      this.container[0],
      spanId
    )
  }

  remove(spanId) {
    const gridElement = getGridElement(spanId)

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }

    this.domPositionCache.gridPositionCache.delete(spanId)
  }

  updateWidth(spanId) {
    const gridElement = getGridElement(spanId)

    // Since block span has no grid, there may not be a grid.
    if (gridElement) {
      adaptWidthToSpan(gridElement, this.domPositionCache, spanId)
    }
  }
}
