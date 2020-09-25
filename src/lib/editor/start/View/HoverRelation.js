import getDomPositionCache from './getDomPositionCache'

export default class {
  constructor(editor, entityContainer) {
    this._editor = editor
    this._entityContainer = entityContainer
  }

  on(entityId) {
    for (const connect of this._getConnectsOf(entityId)) {
      connect.pointup && connect.pointup()
    }
  }

  off(entityId) {
    for (const connect of this._getConnectsOf(entityId)) {
      connect.pointdown && connect.pointdown()
    }
  }

  _getConnectsOf(entityId) {
    return this._entityContainer
      .get(entityId)
      .relations.map((relationId) =>
        getDomPositionCache(this._editor).getConnect(relationId)
      )
  }
}
