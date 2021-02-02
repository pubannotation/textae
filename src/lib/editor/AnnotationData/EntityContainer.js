import EntityModel from '../EntityModel'
import {
  makeDenotationSpanHTMLElementId,
  makeBlockSpanHTMLElementId
} from '../idFactory'
import IdIssueContainer from './IdIssueContainer'

export default class EntityContainer extends IdIssueContainer {
  constructor(editor, emitter, parentContainer, entityGap) {
    super(emitter, 'entity', 'T')

    this._editor = editor

    // Since the attribute container and the entity container are cross-referenced,
    // the entity container is retrieved dynamically.
    this._parentContainer = parentContainer

    this._entityGap = entityGap
  }

  get _spanContainer() {
    return this._parentContainer.span
  }

  get _attributeContainer() {
    return this._parentContainer.attribute
  }

  get _relationContainer() {
    return this._parentContainer.relation
  }

  _toModel(denotation, type) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    return new EntityModel(
      this._editor,
      this._attributeContainer,
      this._relationContainer,
      this._entityGap,
      this._parentContainer.typeDefinition,
      this._getSpan(type, denotation),
      denotation.obj,
      denotation.id
    )
  }

  add(newValue) {
    if (!newValue.span)
      throw new Error(`entity has no span! ${JSON.stringify(newValue)}`)

    // When redoing, the newValue is instance of the EntityModel already.
    if (newValue instanceof EntityModel) {
      return super.add(newValue)
    }

    return super.add(
      new EntityModel(
        this._editor,
        this._attributeContainer,
        this._relationContainer,
        this._entityGap,
        this._parentContainer.typeDefinition,
        this._spanContainer.get(newValue.span),
        newValue.typeName
      )
    )
  }

  moveEntities(span, entities) {
    for (const entity of entities) {
      entity.span = span
    }
    this._emit(`textae-event.annotationData.entity.move`, entities)
  }

  getAllOfSpan(span) {
    return this.all.filter((entity) => span.id === entity.span.id)
  }

  get denotations() {
    return this.all.filter((entity) => entity.isDenotation)
  }

  get blocks() {
    return this.all.filter((entity) => entity.isBlock)
  }

  _getSpan(type, denotation) {
    return this._spanContainer.get(this._getSpanId(type, denotation))
  }

  _getSpanId(type, denotation) {
    switch (type) {
      case 'denotation':
        return makeDenotationSpanHTMLElementId(
          this._editor,
          denotation.span.begin,
          denotation.span.end
        )
      case 'block':
        return makeBlockSpanHTMLElementId(
          this._editor,
          denotation.span.begin,
          denotation.span.end
        )
      default:
        throw `${type} is unknown type span!`
    }
  }
}
