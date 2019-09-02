import idFactory from '../../../../idFactory'
import ContatinerWithEmitter from '../ContatinerWithEmitter'
import EntityModel from './EntityModel'

export default class extends ContatinerWithEmitter {
  constructor(editor, emitter, relation) {
    super(
      emitter,
      'entity',
      (denotations) => mappingFunction(editor, emitter, denotations),
      'T'
    )

    this._relation = relation
  }

  add(entity) {
    if (!entity.span)
      throw new Error(`entity has no span! ${JSON.stringify(entity)}`)

    // When undoing, the entity is instance of the EntityModel already.
    if (entity instanceof EntityModel) {
      return super.add(entity)
    }

    return super.add(new EntityModel(super.emitter, entity.span, entity.type))
  }

  assosicatedRelations(entityId) {
    return this._relation.all
      .filter((r) => r.obj === entityId || r.subj === entityId)
      .map((r) => r.id)
  }
}

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
function toModel(editor, emitter, entity) {
  return new EntityModel(
    emitter,
    idFactory.makeSpanId(editor, entity.span),
    entity.obj,
    entity.id
  )
}

function mappingFunction(editor, emitter, denotations) {
  denotations = denotations || []
  return denotations.map((entity) => toModel(editor, emitter, entity))
}
