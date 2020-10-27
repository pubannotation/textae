export default class HoverRelation {
  constructor(editor, entityContainer) {
    this._editor = editor
    this._entityContainer = entityContainer
  }

  on(entityId) {
    for (const connect of this._getConnectsOf(entityId)) {
      connect.pointup()
    }
  }

  off(entityId) {
    for (const connect of this._getConnectsOf(entityId)) {
      connect.pointdown()
    }
  }

  _getConnectsOf(entityId) {
    return this._entityContainer
      .get(entityId)
      .relations.map((relation) => relation.jsPlumbConnection)
  }
}
