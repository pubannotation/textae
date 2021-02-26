export default class HoverRelation {
  constructor(editor, entityContainer) {
    this._editor = editor
    this._entityContainer = entityContainer
  }

  on(entityId) {
    for (const relation of this._getRelationsOf(entityId)) {
      relation.pointup()
    }
  }

  off(entityId) {
    for (const relation of this._getRelationsOf(entityId)) {
      relation.pointdown()
    }
  }

  _getRelationsOf(entityId) {
    return this._entityContainer.get(entityId).relations
  }
}
