import EntityModel from '../EntityModel'
import idFactory from '../idFactory'
import IdIssueContainer from './IdIssueContainer'

export default class extends IdIssueContainer {
  constructor(editor, emitter, attributeContainer, relationContaier) {
    super(emitter, 'entity', 'T')

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
}
