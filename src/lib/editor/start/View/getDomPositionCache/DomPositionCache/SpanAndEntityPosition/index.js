import CachedGetterFactory from './CachedGetterFactory'
import getSpan from './getSpan'
import getEntity from './getEntity'

const factory = new CachedGetterFactory()

export default class {
  constructor(editor, entityModel, gridPositionCache) {
    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    this._cachedGetSpan = factory((spanId) => getSpan(editor, spanId))
    this._cachedGetEntity = factory((entityId) =>
      getEntity(editor, entityModel, gridPositionCache, entityId)
    )
  }

  reset() {
    this._cachedGetSpan.clear()
    this._cachedGetEntity.clear()
  }

  getSpan(spanId) {
    return this._cachedGetSpan(spanId)
  }

  getEntity(entityId) {
    return this._cachedGetEntity(entityId)
  }
}
