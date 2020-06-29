import getDomPositionCache from '../../getDomPositionCache'
import genArrangeAllGridPositionPromises from './genArrangeAllGridPositionPromises'
import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(editor, annotationData, gridHeight) {
    this._editor = editor
    this._annotationData = annotationData
    this._gridHeight = gridHeight
    this._domPositionCache = getDomPositionCache(editor, annotationData.entity)
  }

  arrangePosition() {
    this._domPositionCache.reset()

    // Cache all span position because alternating between getting offset and setting offset.
    this._domPositionCache.cacheAllSpan(this._annotationData.span.all)

    for (const span of this._annotationData.span.all) {
      arrangeGridPosition(
        this._domPositionCache,
        this._annotationData,
        this._gridHeight,
        span
      )
    }
  }

  arrangePositionAsync() {
    this._domPositionCache.reset()

    return Promise.all(
      genArrangeAllGridPositionPromises(
        this._domPositionCache,
        this._annotationData,
        this._gridHeight
      )
    )
  }
}
