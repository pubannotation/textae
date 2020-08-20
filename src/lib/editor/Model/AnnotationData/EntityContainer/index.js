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
        super.attributeContainer,
        super.relationContainer,
        this.definedTypes,
        entity.span,
        entity.type
      )
    )
  }

  moveEntities(spanId, entities) {
    for (const entity of entities) {
      entity.span = spanId
    }
    this._emit(`textae.annotationData.entity.move`, entities)
  }

  get types() {
    return super.all
      .map((e) => e.type)
      .reduce((acc, type) => acc.set(type.id, type), new Map())
      .values()
  }

  getAllOfSpan(spanId) {
    return this.all.filter((entity) => spanId === entity.span)
  }
}
