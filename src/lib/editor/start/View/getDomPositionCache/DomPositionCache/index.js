import GridPosition from './GridPosition'
import SpanAndEntityPosition from './SpanAndEntityPosition'
import RelationApi from './RelationApi'
import GridApi from './GridApi'

export default class {
  constructor(editor, entityModel) {
    this._gridPosition = new GridPosition(entityModel)
    this._spanAndEntityPosition = new SpanAndEntityPosition(
      editor,
      entityModel,
      this._gridPosition
    )
    this._grid = new GridApi(this._gridPosition)
    this._relation = new RelationApi()
  }

  reset() {
    this._spanAndEntityPosition.reset()
  }

  getSpan(spanId) {
    return this._spanAndEntityPosition.getSpan(spanId)
  }

  getEntity(entityId) {
    return this._spanAndEntityPosition.getEntity(entityId)
  }

  get gridPositionCache() {
    return this._gridPosition
  }

  getGrid(id) {
    return this._grid.getGrid(id)
  }

  setGrid(id, val) {
    this._grid.setGrid(id, val)
  }

  get connectCache() {
    return this._relation.connectCache
  }

  toConnect(relationId) {
    return this._relation.toConnect(relationId)
  }
}
