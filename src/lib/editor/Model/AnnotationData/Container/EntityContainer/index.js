import ContatinerWithEmitter from '../ContatinerWithEmitter'
import EntityModel from './EntityModel'
import mappingFunction from './mappingFunction'

export default class extends ContatinerWithEmitter {
  constructor(editor, emitter) {
    super(
      emitter,
      'entity',
      (denotations) => mappingFunction(editor, emitter, denotations),
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

    return super.add(new EntityModel(super.emitter, entity.span, entity.type))
  }
}
