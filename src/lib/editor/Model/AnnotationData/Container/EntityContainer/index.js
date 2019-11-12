import ContatinerWithSubContainer from '../ContatinerWithSubContainer'
import EntityModel from './EntityModel'
import mappingFunction from './mappingFunction'

export default class extends ContatinerWithSubContainer {
  constructor(editor, emitter) {
    super(
      emitter,
      'entity',
      (denotations) =>
        mappingFunction(
          editor,
          emitter.attribute,
          emitter.relation,
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
        entity.span,
        entity.type
      )
    )
  }

  isBlock(typeName) {
    return this.definedTypes && this.definedTypes.isBlock(typeName)
  }
}
