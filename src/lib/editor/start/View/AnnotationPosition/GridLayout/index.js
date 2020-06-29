import getDomPositionCache from '../../getDomPositionCache'
import genArrangeAllGridPositionPromises from './genArrangeAllGridPositionPromises'
import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(editor, annotationData) {
    this._editor = editor
    this._annotationData = annotationData
    this._domPositionCache = getDomPositionCache(editor, annotationData.entity)
  }

  arrangePosition(typeGap) {
    this._domPositionCache.reset()

    // Cache all span position because alternating between getting offset and setting offset.
    this._domPositionCache.cacheAllSpan(this._annotationData.span.all)

    for (const span of this._annotationData.span.all) {
      arrangeGridPosition(
        this._domPositionCache,
        this._annotationData,
        typeGap,
        span
      )
    }
  }

  arrangePositionAsync(typeGap) {
    this._domPositionCache.reset()

    return Promise.all(
      genArrangeAllGridPositionPromises(
        this._domPositionCache,
        this._annotationData,
        typeGap
      )
    )
  }
}
