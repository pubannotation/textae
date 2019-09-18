import idFactory from '../../../../../idFactory'
import getTypes from './getTypes'

export default class SpanModel {
  constructor(editor, paragraph, span, getAllEntitesFunc) {
    this._editor = editor
    this._span = span
    this._paragraph = paragraph
    this._getAllEntitesFunc = getAllEntitesFunc
  }

  get id() {
    return idFactory.makeSpanId(this._editor, this._span)
  }

  get begin() {
    return this._span.begin
  }

  get end() {
    return this._span.end
  }

  get paragraph() {
    return this._paragraph.getBelongingTo(this._span)
  }

  // Get online for update is not grantieed.
  // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"], attributes: ["A16", "A17"] }.
  get types() {
    return getTypes(this.entities)
  }

  get entities() {
    return this._getAllEntitesFunc().filter((entity) => this.id === entity.span)
  }

  // To determine whether to switch to simple mode, make sure that there are types with multiple entities in the span.
  get hasMultiEntitiesType() {
    return this.types.some(
      (type) => this.entities.filter((e) => e.type.id === type.id).length > 1
    )
  }

  hasBlockType(typeDefinition) {
    return this.types.some((type) => typeDefinition.entity.isBlock(type.name))
  }

  getBlockEntities(typeDefinition) {
    return this.entities.filter((entity) =>
      typeDefinition.entity.isBlock(entity.type.name)
    )
  }
}
