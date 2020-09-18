import SpanAndEntityPosition from './SpanAndEntityPosition'
import LesserMap from './LesserMap'

export default class {
  constructor(editor, entityModel) {
    this._entityModel = entityModel

    // The chache for position of grids.
    // This is updated at arrange position of grids.
    // This is referenced at create or move relations.
    this._gridPosition = new LesserMap()
    this._spanAndEntityPosition = new SpanAndEntityPosition(
      editor,
      entityModel,
      this._gridPosition
    )
    this._relation = new LesserMap()
  }

  get gridPositionCache() {
    return this._gridPosition
  }

  reset() {
    this._spanAndEntityPosition.reset()
  }

  getSpan(spanId) {
    return this._spanAndEntityPosition.getSpan(spanId)
  }

  getGrid(id) {
    return this._gridPosition.get(id)
  }

  getEntity(entityId) {
    return this._spanAndEntityPosition.getEntity(entityId)
  }

  cacheAllSpan(spans) {
    for (const span of spans) {
      this._spanAndEntityPosition.getSpan(span.id)
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
