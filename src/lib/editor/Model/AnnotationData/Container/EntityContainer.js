import idFactory from '../../../idFactory'
import ModelContainer from './ModelContainer'
import _ from 'underscore'

const EntityContainer = function(editor, emitter, relation) {
  const getAttributesOf = (entityId) => {
    return emitter.attribute.all()
      .filter((a) => a.subj === entityId)
  }

  // Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
  const toModel = function(editor, entity) {
    return {
      id: entity.id,
      span: idFactory.makeSpanId(editor, entity.span),
      type: entity.obj,
      get attributes() {
        return getAttributesOf(entity.id)
      }
    }
  }

  const mappingFunction = function(editor, denotations) {
    denotations = denotations || []
    return denotations.map(_.partial(toModel, editor))
  }

  const entityContainer = new ModelContainer(
    emitter,
    'entity',
    _.partial(mappingFunction, editor),
    'T'
  )

  const originAdd = entityContainer.add
  const add = (entity) => {
    if (!entity.span) throw new Error('entity has no span! ' + JSON.stringify(entity))

    if (!entity.attributes) {
      // When undoing, the entity already has id and attributes getters.
      // When moving a span, the entity already has id.
      return originAdd(entity, () => {
        Object.defineProperty(entity, "attributes", {
          get: function() {
            return getAttributesOf(entity.id)
          }
        })
      })
    }

    return originAdd(entity)
  }

  const assosicatedRelations = function(entityId) {
    return relation.all()
      .filter(function(r) {
        return r.obj === entityId || r.subj === entityId
      })
      .map(function(r) {
        return r.id
      })
  }

  return Object.assign(
    entityContainer, {
      add,
      assosicatedRelations
    }
  )
}

module.exports = EntityContainer
