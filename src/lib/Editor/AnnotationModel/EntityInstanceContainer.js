import EntityInstance from '../EntityInstance'
import IdIssueContainer from './IdIssueContainer'

export default class EntityInstanceContainer extends IdIssueContainer {
  #editorID
  #annotationModel
  #typeGap
  #namespaceInstanceContainer
  #toolBarHeight

  constructor(editorID, eventEmitter, annotationModel, typeGap) {
    super(eventEmitter, 'entity', (instance) =>
      instance.isDenotation ? 'T' : 'B'
    )

    this.#editorID = editorID

    // Since the attribute instance container and the entity instance container are cross-referenced,
    // the entity instance retrieves other containers dynamically.
    this.#annotationModel = annotationModel

    this.#typeGap = typeGap
    this.#namespaceInstanceContainer =
      annotationModel.namespaceInstanceContainer
  }

  get #spanInstanceContainer() {
    return this.#annotationModel.spanInstanceContainer
  }

  get #attributeInstanceContainer() {
    return this.#annotationModel.attributeInstanceContainer
  }

  get #relationInstanceContainer() {
    return this.#annotationModel.relationInstanceContainer
  }

  /** @param {number} value */
  set toolBarHeight(value) {
    this.#toolBarHeight = value
  }

  _toInstance(denotation, type) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    const span = this.#getSpan(type, denotation)
    const newInstance = new EntityInstance(
      this.#editorID,
      this.#attributeInstanceContainer,
      this.#relationInstanceContainer,
      this.#namespaceInstanceContainer,
      this.#typeGap,
      this.#annotationModel.typeDictionary,
      span,
      denotation.obj,
      this.#toolBarHeight,
      denotation.id
    )

    return newInstance
  }

  add(newValue) {
    // When redoing, the newValue is instance of the EntityInstance already.
    if (newValue instanceof EntityInstance) {
      if (!newValue.span) {
        throw new Error(`entity has no span! ${JSON.stringify(newValue)}`)
      }

      super.add(newValue)
      newValue.span.add(newValue)
      newValue.render()
      return newValue
    }

    if (
      newValue.spanType === undefined ||
      newValue.begin === undefined ||
      newValue.end === undefined
    ) {
      throw new Error(
        `entity has no span information! ${JSON.stringify(newValue)}`
      )
    }

    const span = this.#spanInstanceContainer.find(
      newValue.spanType,
      newValue.begin,
      newValue.end
    )
    const newEntity = new EntityInstance(
      this.#editorID,
      this.#attributeInstanceContainer,
      this.#relationInstanceContainer,
      this.#namespaceInstanceContainer,
      this.#typeGap,
      this.#annotationModel.typeDictionary,
      span,
      newValue.typeName,
      this.#toolBarHeight
    )

    console.assert(
      newEntity.span.isDenotation || newEntity.span.entities.length > 0,
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

    super._emit(`textae-event.annotation-data.entity.move`)
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

  #getSpan(type, denotation) {
    return this.#spanInstanceContainer.find(
      type,
      denotation.span.begin,
      denotation.span.end
    )
  }

  hasDenotation(denotationID) {
    return this.denotations.some((denotation) => denotation.id === denotationID)
  }
}
