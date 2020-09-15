import EntityModel from '../EntityModel'
import issueId from './issueId'
import idFactory from '../idFactory'
import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(editor, emitter, attributeContainer, relationContaier) {
    super(emitter, 'entity')

    this._editor = editor

    this._attributeContainer = attributeContainer
    this._relationContainer = relationContaier
  }

  _toModel(entity) {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    return new EntityModel(
      this._editor,
      this._attributeContainer,
      this._relationContainer,
      this.definedTypes,
      idFactory.makeSpanDomId(this._editor, entity.span),
      entity.obj,
      entity.id
    )
  }

  _toModels(denotations) {
    const collection = super._toModels(denotations)

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
