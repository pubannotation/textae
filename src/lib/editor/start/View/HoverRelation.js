export default class HoverRelation {
  constructor(editor, entityContainer) {
    this._editor = editor
    this._entityContainer = entityContainer
  }

  on(entityId) {
    this._entityContainer.get(entityId).pointUpRelations()
  }

  off(entityId) {
    this._entityContainer.get(entityId).pointDownRelations()
  }
}
