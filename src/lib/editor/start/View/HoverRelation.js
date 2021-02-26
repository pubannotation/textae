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
    // Relationships are rendered asynchronously.
    // You can create a relationship fast
    // by holding down the control or command key
    // and hitting the object entity continuously.
    // When you do this, a mouse-out event may occur
    // before the rendering of the relationship is complete.
    // You need to make sure that the relationship has been rendered.
    return this._entityContainer.get(entityId).relations
  }
}
