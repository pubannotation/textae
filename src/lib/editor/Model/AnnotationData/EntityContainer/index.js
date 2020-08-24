import ContainerWithSubContainer from '../ContainerWithSubContainer'
import EntityModel from './EntityModel'
import mappingFunction from './mappingFunction'

export default class extends ContainerWithSubContainer {
  constructor(editor, emitter, parentContainer) {
    super(
      emitter,
      parentContainer,
      'entity',
      (denotations) =>
        mappingFunction(
          editor,
          super.attributeContainer,
          super.relationContainer,
          this.definedTypes,
          denotations
        ),
      'T'
    )

    this._editor = editor
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
        super.attributeContainer,
        super.relationContainer,
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
