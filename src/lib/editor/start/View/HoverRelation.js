export default class HoverRelation {
  constructor(editor, entityContainer) {
    this._editor = editor
    this._entityContainer = entityContainer
  }

  on(entityId) {
    for (const relation of this._getRelationsOf(entityId)) {
      relation.pointUp()
    }
  }

  off(entityId) {
    for (const relation of this._getRelationsOf(entityId)) {
      relation.pointDown()
    }
  }

  _getRelationsOf(entityId) {
    return this._entityContainer.get(entityId).relations
  }
}
