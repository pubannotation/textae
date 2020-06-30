import idFactory from '../../../../idFactory'
import getTypes from './getTypes'
import SpanModel from '../SpanModel'

export default class extends SpanModel {
  constructor(editor, span, entityContainer, style) {
    super(editor, span)
    this._entityContainer = entityContainer
  }

  // Get online for update is not grantieed.
  // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"], attributes: ["A16", "A17"] }.
  get types() {
    return getTypes(this.entities)
  }

  get entities() {
    return this._entityContainer.getAllOfSpan(this.id)
  }

  // To determine whether to switch to simple mode, make sure that there are types with multiple entities in the span.
  get hasMultiEntitiesType() {
    return this.types.some(
      (type) => this.entities.filter((e) => e.type.id === type.id).length > 1
    )
  }

  passesAllEntitiesTo(newSpan) {
    this.entities.forEach((e) => (e.span = newSpan.id))
  }
}
