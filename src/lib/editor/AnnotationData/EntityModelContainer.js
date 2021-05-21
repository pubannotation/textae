import EntityModel from '../EntityModel'
import {
  makeDenotationSpanHTMLElementId,
  makeBlockSpanHTMLElementId
} from '../idFactory'
import IdIssueContainer from './IdIssueContainer'

export default class EntityModelContainer extends IdIssueContainer {
  constructor(editor, emitter, parent, entityGap, namespace) {
    super(emitter, 'entity', 'T')

    this._editor = editor

    // Since the attribute model container and the entity model container are cross-referenced,
    // the entity model retrieves other containers dynamically.
    this._parent = parent

    this._entityGap = entityGap
    this._namespace = namespace
  }

  get _spanModelContainer() {
    return this._parent.span
  }

  get _attributeModelContainer() {
    return this._parent.attribute
  }

  get _relationModelContainer() {
    return this._parent.relation
  }

  _toModel(denotation, type) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    return new EntityModel(
      this._editor,
      this._attributeModelContainer,
      this._relationModelContainer,
      this._entityGap,
      this._parent.typeDefinition,
      this._getSpan(type, denotation),
      denotation.obj,
      this._namespace,
      denotation.id
    )
  }

  add(newValue) {
    if (!newValue.span)
      throw new Error(`entity has no span! ${JSON.stringify(newValue)}`)

    // When redoing, the newValue is instance of the EntityModel already.
    if (newValue instanceof EntityModel) {
      super.add(newValue)
      newValue.render()
      return newValue
    }

    const newEntity = new EntityModel(
      this._editor,
      this._attributeModelContainer,
      this._relationModelContainer,
      this._entityGap,
      this._parent.typeDefinition,
      this._spanModelContainer.get(newValue.span),
      newValue.typeName,
      this._namespace
    )

    super.add(newEntity)
    newEntity.render()
    return newEntity
  }

  remove(id) {
    const instance = super.remove(id)
    instance.erase()
  }

  changeType(id, newType) {
    const entity = super.changeType(id, newType)
    entity.updateElement()
    return entity
  }

  moveEntities(span, entities) {
    for (const entity of entities) {
      entity.span = span
      entity.erase()
      entity.render()
    }

    this._emit(`textae-event.annotation-data.entity.move`)
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

  redrawEntitiesWithSpecifiedAttribute(pred) {
    for (const entity of this.all.filter((e) =>
      e.typeValues.hasSpecificPredicateAttribute(pred)
    )) {
      entity.updateElement()
    }
  }

  _getSpan(type, denotation) {
    return this._spanModelContainer.get(this._getSpanId(type, denotation))
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
