import LesserMap from './LesserMap'
import getSpan from './getSpan'
import getEntityDom from '../../../getEntityDom'

export default class {
  constructor(editor, entityModel) {
    this._editor = editor
    this._entityModel = entityModel

    // The chache for position of grids.
    // This is updated at arrange position of grids.
    // This is referenced at create or move relations.
    this._gridPosition = new LesserMap()

    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    this._spanCache = new LesserMap()

    this._entityCache = new LesserMap()

    this._relation = new LesserMap()
  }

  get gridPositionCache() {
    return this._gridPosition
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

  getGrid(id) {
    return this._gridPosition.get(id)
  }

  getEntity(entityId) {
    if (!this._entityCache.has(entityId)) {
      const entity = getEntityDom(this._editor, entityId)

      if (!entity) {
        throw new Error(`entity is not rendered : ${entityId}`)
      }

      const spanId = this._entityModel.get(entityId).span
      const gridPosition = this._gridPosition.get(spanId)

      return {
        top: gridPosition.top + entity.offsetTop,
        center: gridPosition.left + entity.offsetLeft + entity.offsetWidth / 2
      }
    }

    return this._entityCache.get(entityId)
  }

  cacheAllSpan(spans) {
    for (const span of spans) {
      this.getSpan(span.id)
    }
  }

  setGrid(id, val) {
    this._gridPosition.set(id, val)
  }

  get connectCache() {
    return this._relation
  }

  toConnect(relationId) {
    return this._relation.get(relationId)
  }

  isGridPrepared(entityId) {
    const spanId = this._entityModel.get(entityId).span
    return this._gridPosition.get(spanId)
  }
}
