import getSpan from './getSpan'
import getEntity from './getEntity'
import LesserMap from '../LesserMap'

export default class {
  constructor(editor, entityModel, gridPositionCache) {
    this._editor = editor
    this._entityModel = entityModel
    this._gridPositionCache = gridPositionCache

    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    this._spanCache = new LesserMap()
    this._entityCache = new LesserMap()
  }

  reset() {
    this._spanCache.clear()
    this._entityCache.clear()
  }

  getSpan(spanId) {
    if (!this._spanCache.has(spanId)) {
      this._spanCache.set(spanId, getSpan(this._editor, spanId))
    }

    return this._spanCache.get(spanId)
  }

  getEntity(entityId) {
    if (!this._entityCache.has(entityId)) {
      this._entityCache.set(
        entityId,
        getEntity(
          this._editor,
          this._entityModel,
          this._gridPositionCache,
          entityId
        )
      )
    }

    return this._entityCache.get(entityId)
  }
}
