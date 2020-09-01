import SpanModel from './SpanModel'

export default class extends SpanModel {
  constructor(editor, span, entityContainer, spanContainer) {
    super(editor, span, spanContainer)
    this._entityContainer = entityContainer
  }

  get entities() {
    return this._entityContainer.getAllOfSpan(this.id)
  }

  passesAllEntitiesTo(newSpan) {
    this.entities.forEach((e) => (e.span = newSpan.id))
  }
}
