import idFactory from '../../../idFactory'
import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(editor, emitter, relation) {
    super(
      emitter,
      'entity',
      (denotations) => mappingFunction(editor, emitter, denotations),
      'T'
    )
    this.emitter = emitter
    this.relation = relation
  }

  add(entity) {
    if (!entity.span)
      throw new Error('entity has no span! ' + JSON.stringify(entity))

    if (!entity.attributes) {
      // When undoing, the entity already has id and attributes getters.
      // When moving a span, the entity already has id.
      const emitter = this.emitter
      return super.add(entity, () => {
        Object.defineProperty(entity, 'attributes', {
          get: () => getAttributesOf(emitter, entity.id)
        })
      })
    }

    return super.add(entity)
  }

  assosicatedRelations(entityId) {
    return this.relation
      .all()
      .filter((r) => r.obj === entityId || r.subj === entityId)
      .map((r) => r.id)
  }
}

function getAttributesOf(emitter, entityId) {
  return emitter.attribute.all().filter((a) => a.subj === entityId)
}

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
function toModel(editor, emitter, entity) {
  return {
    id: entity.id,
    span: idFactory.makeSpanId(editor, entity.span),
    type: entity.obj,
    get attributes() {
      return getAttributesOf(emitter, entity.id)
    }
  }
}

function mappingFunction(editor, emitter, denotations) {
  denotations = denotations || []
  return denotations.map((entity) => toModel(editor, emitter, entity))
}
