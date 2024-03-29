import EntityInstance from '../EntityInstance'
import {
  makeDenotationSpanHTMLElementID,
  makeBlockSpanHTMLElementID
} from '../idFactory'
import IdIssueContainer from './IdIssueContainer'

export default class EntityInstanceContainer extends IdIssueContainer {
  constructor(editorID, eventEmitter, parent, typeGap, namespace) {
    super(eventEmitter, 'entity', (instance) =>
      instance.isDenotation ? 'T' : 'B'
    )

    this._editorID = editorID

    // Since the attribute instance container and the entity instance container are cross-referenced,
    // the entity instance retrieves other containers dynamically.
    this._parent = parent

    this._typeGap = typeGap
    this._namespace = namespace
  }

  get _spanInstanceContainer() {
    return this._parent.span
  }

  get _attributeInstanceContainer() {
    return this._parent.attribute
  }

  get _relationInstanceContainer() {
    return this._parent.relation
  }

  /** @param {number} value */
  set controlBarHeight(value) {
    this._controlBarHeight = value
  }

  _toInstance(denotation, type) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    const span = this._getSpan(type, denotation)
    const newInstance = new EntityInstance(
      this._editorID,
      this._attributeInstanceContainer,
      this._relationInstanceContainer,
      this._typeGap,
      this._parent.typeDefinition,
      span,
      denotation.obj,
      this._namespace,
      this._controlBarHeight,
      denotation.id
    )

    return newInstance
  }

  add(newValue) {
    if (!newValue.span)
      throw new Error(`entity has no span! ${JSON.stringify(newValue)}`)

    // When redoing, the newValue is instance of the EntityInstance already.
    if (newValue instanceof EntityInstance) {
      super.add(newValue)
      newValue.span.add(newValue)
      newValue.render()
      return newValue
    }

    const span = this._spanInstanceContainer.get(newValue.span)
    const newEntity = new EntityInstance(
      this._editorID,
      this._attributeInstanceContainer,
      this._relationInstanceContainer,
      this._typeGap,
      this._parent.typeDefinition,
      span,
      newValue.typeName,
      this._namespace,
      this._controlBarHeight
    )

    console.assert(
      newEntity.span.isDenotation || newEntity.span.entities.length === 0,
      'A block span cannot have more than one entity.'
    )

    super.add(newEntity)
    newEntity.render()
    return newEntity
  }

  remove(id) {
    // Calculates the grid position in response to entity removal events.
    // Remove entity from Span before the event fires.
    const instance = super.get(id)
    instance.span.remove(instance)
    super.remove(id)

    instance.erase()
  }

  changeType(id, newType) {
    const entity = super.changeType(id, newType)
    entity.updateElement()
    return entity
  }

  moveEntities(span, entities) {
    for (const entity of entities) {
      entity.erase()

      const spanBeforeMove = entity.span
      spanBeforeMove.remove(entity)
      spanBeforeMove.updateSelfAndAncestorsGridPosition()

      entity.span = span
      entity.render()

      for (const relation of entity.relations) {
        relation.redrawLineConsideringSelection()
      }
    }

    this._emit(`textae-event.annotation-data.entity.move`)
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
    return this._spanInstanceContainer.get(this._getSpanId(type, denotation))
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

  hasDenotation(denotationID) {
    return this.denotations.some((denotation) => denotation.id === denotationID)
  }
}
