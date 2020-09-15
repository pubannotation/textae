import EntityModel from '../EntityModel'
import issueId from './issueId'
import idFactory from '../idFactory'
import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(editor, emitter, parentContainer) {
    super(emitter, 'entity')

    this._editor = editor
    this._parentContainer = parentContainer
  }

  get _attributeContainer() {
    return this._parentContainer.attribute
  }

  get _relationContainer() {
    return this._parentContainer.relation
  }

  _toModels(denotations) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    const collection = denotations.map(
      (entity) =>
        new EntityModel(
          this._editor,
          this._attributeContainer,
          this._relationContainer,
          this.definedTypes,
          idFactory.makeSpanDomId(this._editor, entity.span),
          entity.obj,
          entity.id
        )
    )

    // Move medols without id behind others, to prevet id duplication generated and exists.
    collection.sort((a, b) => {
      if (!a.id) return 1
      if (!b.id) return -1
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1

      return 0
    })

    return collection
  }

  add(entity) {
    if (!entity.span)
      throw new Error(`entity has no span! ${JSON.stringify(entity)}`)

    // When redoing, the entity is instance of the EntityModel already.
    if (entity instanceof EntityModel) {
      return super.add(entity)
    }

    return super.add(
      new EntityModel(
        this._editor,
        this._attributeContainer,
        this._relationContainer,
        this.definedTypes,
        entity.span,
        entity.typeName
      )
    )
  }

  moveEntities(spanId, entities) {
    for (const entity of entities) {
      entity.span = spanId
    }
    this._emit(`textae.annotationData.entity.move`, entities)
  }

  getAllOfSpan(spanId) {
    return this.all.filter((entity) => spanId === entity.span)
  }

  _addToContainer(instance) {
    return super._addToContainer(issueId(instance, this._container, 'T'))
  }
}
