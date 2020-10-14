import SpanModel from './SpanModel'

export default class ObjectSpanModel extends SpanModel {
  constructor(editor, span, entityContainer, spanContainer) {
    super(editor, span.begin, span.end, spanContainer)
    this._entityContainer = entityContainer
  }

  get entities() {
    return this._entityContainer.getAllOfSpan(this)
  }

  passesAllEntitiesTo(newSpan) {
    for (const entity of this.entities) {
      entity.span = newSpan
    }
  }

  get styles() {
    // Merges a span and a typeset so that it can be rendered as a single DOM element.
    if (this._spanContainer._typeSets.has(this.id)) {
      return this._spanContainer._typeSets.get(this.id).styles
    }

    return new Set()
  }
}
