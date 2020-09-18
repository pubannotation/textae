import getSpan from './getSpan'
import getEntity from './getEntity'
import LesserMap from '../LesserMap'

function factory(getter) {
  const map = new LesserMap()

  const func = (id) => {
    if (!map.has(id)) {
      map.set(id, getter(id))
    }

    return map.get(id)
  }

  func.clear = () => {
    map.clear()
  }

  return func
}

export default class {
  constructor(editor, entityModel, gridPositionCache) {
    this._editor = editor

    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    this._spanCache = new LesserMap()
    this._cachedGetEntity = factory((entityId) =>
      getEntity(editor, entityModel, gridPositionCache, entityId)
    )
  }

  reset() {
    this._spanCache.clear()
    this._cachedGetEntity.clear()
  }

  getSpan(spanId) {
    if (!this._spanCache.has(spanId)) {
      this._spanCache.set(spanId, getSpan(this._editor, spanId))
    }

    return this._spanCache.get(spanId)
  }

  getEntity(entityId) {
    return this._cachedGetEntity(entityId)
  }
}
