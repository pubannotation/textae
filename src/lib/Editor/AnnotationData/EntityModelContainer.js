import EntityModel from '../EntityModel'
import {
  makeDenotationSpanHTMLElementID,
  makeBlockSpanHTMLElementID
} from '../idFactory'
import IdIssueContainer from './IdIssueContainer'

export default class EntityModelContainer extends IdIssueContainer {
  constructor(editorID, eventEmitter, parent, typeGap, namespace) {
    super(eventEmitter, 'entity', (instance) =>
      instance.isDenotation ? 'T' : 'B'
    )

    this._editorID = editorID

    // Since the attribute model container and the entity model container are cross-referenced,
    // the entity model retrieves other containers dynamically.
    this._parent = parent

    this._typeGap = typeGap
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

  /** @param {number} value */
  set controlBarHeight(value) {
    this._controlBarHeight = value
  }

  addSource(source, type) {
    super.addSource(source, type)
    this._resetMemo()
  }

  _toModel(denotation, type) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    return new EntityModel(
      this._editorID,
      this._attributeModelContainer,
      this._relationModelContainer,
      this._typeGap,
      this._parent.typeDefinition,
      this._getSpan(type, denotation),
      denotation.obj,
      this._namespace,
      this._controlBarHeight,
      denotation.id
    )
  }

  add(newValue) {
    if (!newValue.span)
      throw new Error(`entity has no span! ${JSON.stringify(newValue)}`)

    // When redoing, the newValue is instance of the EntityModel already.
    if (newValue instanceof EntityModel) {
      super.add(newValue)
      this._resetMemo()
      newValue.render()
      return newValue
    }

    const newEntity = new EntityModel(
      this._editorID,
      this._attributeModelContainer,
      this._relationModelContainer,
      this._typeGap,
      this._parent.typeDefinition,
      this._spanModelContainer.get(newValue.span),
      newValue.typeName,
      this._namespace,
      this._controlBarHeight
    )

    console.assert(
      newEntity.span.isDenotation || newEntity.span.entities.length === 0,
      'A blockspan cannot have more than one entity.'
    )

    super.add(newEntity)
    this._resetMemo()
    newEntity.render()
    return newEntity
  }

  remove(id) {
    const instance = super.remove(id)
    instance.erase()
    this._resetMemo()
  }

  changeType(id, newType) {
    const entity = super.changeType(id, newType)
    entity.updateElement()
    return entity
  }

  moveEntities(span, entities) {
    for (const entity of entities) {
      const spanBeforeMove = entity.span
      entity.span = span
      this._resetMemo()
      entity.erase()
      spanBeforeMove.updateSelfAndAncestorsGridPosition()

      entity.render()

      for (const relation of entity.relations) {
        relation.redrawLineConsideringSelection()
      }
    }

    this._emit(`textae-event.annotation-data.entity.move`)
  }

  getAllOfSpan(span) {
    if (this._allOfSpanMemo === null) {
      this._allOfSpanMemo = new Map()
    }

    if (this._allOfSpanMemo.has(span)) {
      return this._allOfSpanMemo.get(span)
    }

    this._allOfSpanMemo.set(
      span,
      this.all.filter((entity) => span.id === entity.span.id)
    )
    return this._allOfSpanMemo.get(span)
  }

  get denotations() {
    return this.all.filter((entity) => entity.isDenotation)
  }

  get blocks() {
    return this.all.filter((entity) => entity.isBlock)
  }

  redrawEntitiesWithSpecifiedAttribute(pred) {
    const entities = this.all.filter((e) =>
      e.typeValues.hasSpecificPredicateAttribute(pred)
    )
    for (const entity of entities) {
      entity.updateElement()
    }

    // If you change the media height attribute of the string attribute definition,
    // you may need to change the position of the Grid.
    for (const span of new Set([...entities.map(({ span }) => span)])) {
      span.updateGridPosition()
    }
  }

  clarifyLabelOfAll() {
    for (const entity of this.all) {
      entity.clarifyLabel()
    }
  }

  declarifyLabelOfAll() {
    for (const entity of this.all) {
      entity.declarifyLabel()
    }
  }

  _getSpan(type, denotation) {
    return this._spanModelContainer.get(this._getSpanId(type, denotation))
  }

  _getSpanId(type, denotation) {
    switch (type) {
      case 'denotation':
        return makeDenotationSpanHTMLElementID(
          this._editorID,
          denotation.span.begin,
          denotation.span.end
        )
      case 'block':
        return makeBlockSpanHTMLElementID(
          this._editorID,
          denotation.span.begin,
          denotation.span.end
        )
      default:
        throw `${type} is unknown type span!`
    }
  }

  _resetMemo() {
    this._allOfSpanMemo = null
  }
}
