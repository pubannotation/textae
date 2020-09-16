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

  get styles() {
    // Merges a span and a typeset so that it can be rendered as a single DOM element.
    if (this._spanContainer._typeSets.has(this.id)) {
      return this._spanContainer._typeSets.get(this.id).styles
    }

    return new Set()
  }
}
