import EntityModel from '../EntityModel'
import idFactory from '../idFactory'
import IdIssueContainer from './IdIssueContainer'

export default class extends IdIssueContainer {
  constructor(editor, emitter, parentContainer) {
    super(emitter, 'entity', 'T')

    this._editor = editor

    // Since the attribute container and the entity container are cross-referenced,
    // the entity container is retrieved dynamically.
    this._parentContainer = parentContainer
  }

  get _attributeContainer() {
    return this._parentContainer.attribute
  }

  get _relationContainer() {
    return this._parentContainer.relation
  }

  _toModel(denotation) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    return new EntityModel(
      this._editor,
      this._attributeContainer,
      this._relationContainer,
      this.definedTypes,
      idFactory.makeSpanDomId(this._editor, denotation.span),
      denotation.obj,
      denotation.id
    )
  }

  add(newValue) {
    if (!newValue.span)
      throw new Error(`entity has no span! ${JSON.stringify(newValue)}`)

    // When redoing, the entity is instance of the EntityModel already.
    if (newValue instanceof EntityModel) {
      return super.add(newValue)
    }

    return super.add(
      new EntityModel(
        this._editor,
        this._attributeContainer,
        this._relationContainer,
        this.definedTypes,
        newValue.span,
        newValue.typeName
      )
    )
  }

  moveEntities(spanId, entities) {
    for (const entity of entities) {
      entity.span = spanId
    }
    this._emit(`textae.annotationData.entity.move`, entities)
  }

  getAllOfSpan(span) {
    return this.all.filter((entity) => span.id === entity.span)
  }
}
