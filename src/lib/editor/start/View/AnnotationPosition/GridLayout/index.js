import getSpanPositionCache from '../../getSpanPositionCache'
import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(editor, annotationData, gridHeight) {
    this._editor = editor
    this._annotationData = annotationData
    this._gridHeight = gridHeight
    this._spanPositionCache = getSpanPositionCache(editor)
  }

  arrangePosition() {
    this._spanPositionCache.clear()

    // Cache all span position because alternating between getting offset and setting offset.
    this._spanPositionCache.cacheAll(this._annotationData.span.allSpansWithGrid)

    for (const span of this._annotationData.span.allSpansWithGrid) {
      arrangeGridPosition(
        this._spanPositionCache,
        this._annotationData,
        this._gridHeight,
        span
      )
    }
  }
}
