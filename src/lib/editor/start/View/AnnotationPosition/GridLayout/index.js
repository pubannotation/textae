import getDomPositionCache from '../../getDomPositionCache'
import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(editor, annotationData, gridHeight) {
    this._editor = editor
    this._annotationData = annotationData
    this._gridHeight = gridHeight
    this._domPositionCache = getDomPositionCache(editor)
  }

  arrangePosition() {
    this._domPositionCache.removeAllSpan()

    // Cache all span position because alternating between getting offset and setting offset.
    this._domPositionCache.cacheAllSpan(
      this._annotationData.span.allSpansWithGrid
    )

    for (const span of this._annotationData.span.allSpansWithGrid) {
      arrangeGridPosition(
        this._domPositionCache,
        this._annotationData,
        this._gridHeight,
        span
      )
    }
  }
}
