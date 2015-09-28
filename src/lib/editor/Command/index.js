import {
  CreateCommand, RemoveCommand, ChangeTypeCommand
}
from './commandTemplate'

var invokeCommand = require('./invokeCommand'),
  executeCompositCommand = require('./executeCompositCommand'),
  getReplicationSpans = require('./getReplicationSpans'),
  idFactory = require('../idFactory')

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
module.exports = function(editor, model, history) {
  var spanCreateCommand = (span) => new CreateCommand(model, 'span', true, span),
    entityCreateCommand = (entity) => new CreateCommand(model, 'entity', true, entity),
    spanAndDefaultEntryCreateCommand = function(type, span) {
      var id = idFactory.makeSpanId(editor, span),
        createSpan = spanCreateCommand(span),
        createEntity = entityCreateCommand({
          span: id,
          type: type
        }),
        subCommands = [createSpan, createEntity]

      return {
        execute: function() {
          executeCompositCommand('span', this, 'create', id, subCommands)
        }
      }
    },
    spanReplicateCommand = function(type, span, detectBoundaryFunc) {
      var createSpan = _.partial(spanAndDefaultEntryCreateCommand, type),
        subCommands = getReplicationSpans(model.annotationData, span, detectBoundaryFunc)
        .map(createSpan)

      return {
        execute: function() {
          executeCompositCommand('span', this, 'replicate', span.id, subCommands)
        }
      }
    },
    // The relaitonId is optional set only when revert of the relationRemoveCommand.
    // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
    relationCreateCommand = (relation) => new CreateCommand(model, 'relation', false, relation),
    relationCreateAndSelectCommand = (relation) => new CreateCommand(model, 'relation', true, relation),
    modificationRemoveCommand = (modification) => new RemoveCommand(model, 'modification', modification),
    relationRemoveCommand = (relation) => new RemoveCommand(model, 'relation', relation),
    relationAndAssociatesRemoveCommand = function(id) {
      var removeRelation = relationRemoveCommand(id),
        removeModification = model.annotationData.getModificationOf(id)
        .map(function(modification) {
          return modification.id
        })
        .map(function(id) {
          return modificationRemoveCommand(id)
        }),
        subCommands = removeModification.concat(removeRelation)

      return {
        execute: function() {
          executeCompositCommand('relation', this, 'remove', id, subCommands)
        }
      }
    },
    entityRemoveCommand = (entity) => new RemoveCommand(model, 'entity', entity),
    entityAndAssociatesRemoveCommand = function(id) {
      var removeEntity = entityRemoveCommand(id),
        removeRelation = model.annotationData.entity.assosicatedRelations(id)
        .map(function(id) {
          return relationRemoveCommand(id)
        }),
        removeModification = model.annotationData.getModificationOf(id)
        .map(function(modification) {
          return modification.id
        })
        .map(function(id) {
          return modificationRemoveCommand(id)
        }),
        subCommands = removeRelation.concat(removeModification).concat(removeEntity)

      return {
        execute: function() {
          executeCompositCommand('entity', this, 'remove', id, subCommands)
        }
      }
    },
    spanRemoveCommand = function(id) {
      var removeSpan = new RemoveCommand(model, 'span', id),
        removeEntity = _.flatten(model.annotationData.span.get(id).getTypes().map(function(type) {
          return type.entities.map(function(entityId) {
            return entityAndAssociatesRemoveCommand(entityId)
          })
        })),
        subCommands = removeEntity.concat(removeSpan)

      return {
        execute: function() {
          executeCompositCommand('span', this, 'remove', id, subCommands)
        }
      }
    },
    toEntityPerSpan = function(ids) {
      return ids
        .map(function(id) {
          var span = model.annotationData.entity.get(id).span
          return {
            id: id,
            span: span
          }
        })
        .reduce(function(ret, entity) {
          var hoge = ret[entity.span] ? ret[entity.span] : []
          hoge.push(entity.id)
          ret[entity.span] = hoge
          return ret
        }, {})
    },
    entityRemoveAndSpanRemeveIfNoEntityRestCommand = function(ids) {
      var entityPerSpan = toEntityPerSpan(ids)

      return _.flatten(
        Object
        .keys(entityPerSpan)
        .map(function(spanId) {
          var span = model.annotationData.span.get(spanId),
            targetIds = entityPerSpan[spanId],
            allEntitiesOfSpan = _.flatten(
              span
              .getTypes()
              .map(function(type) {
                return type.entities
              })
            ),
            restEntities = _.reject(
              allEntitiesOfSpan,
              function(entityId) {
                return _.contains(targetIds, entityId)
              }
            )

          return {
            entities: targetIds,
            spasId: spanId,
            noRestEntities: restEntities.length === 0
          }
        })
        .map(function(data) {
          if (data.noRestEntities)
            return spanRemoveCommand(data.spasId)
          else
            return data.entities.map(function(id) {
              return entityAndAssociatesRemoveCommand(id)
            })
        })
      )
    },
    entityChangeTypeRemoveRelationCommand = function(id, newType, isRemoveRelations) {
      // isRemoveRelations is set true when newType is block.
      var changeType = new ChangeTypeCommand(model, 'entity', id, newType),
        subCommands = isRemoveRelations ?
        model.annotationData.entity.assosicatedRelations(id)
        .map(function(id) {
          return relationRemoveCommand(id)
        })
        .concat(changeType) : [changeType]

      return {
        execute: function() {
          executeCompositCommand('entity', this, 'change', id, subCommands)
        }
      }
    },
    spanMoveCommand = function(spanId, newSpan) {
      var subCommands = [],
        newSpanId = idFactory.makeSpanId(editor, newSpan),
        d = model.annotationData

      if (!d.span.get(newSpanId)) {
        subCommands.push(spanRemoveCommand(spanId))
        subCommands.push(spanCreateCommand({
          begin: newSpan.begin,
          end: newSpan.end
        }))
        d.span.get(spanId).getTypes().forEach(function(type) {
          type.entities.forEach(function(id) {
            subCommands.push(entityCreateCommand({
              id: id,
              span: newSpanId,
              type: type.name
            }))

            subCommands = subCommands.concat(
              d.entity.assosicatedRelations(id)
              .map(d.relation.get)
              .map(function(relation) {
                return relationCreateCommand(relation)
              })
            )
          })
        })
      }

      return {
        execute: function() {
          executeCompositCommand('span', this, 'move', spanId, subCommands)
        }
      }
    }

  var factory = {
    spanCreateCommand: spanAndDefaultEntryCreateCommand,
    spanRemoveCommand: spanRemoveCommand,
    spanMoveCommand: spanMoveCommand,
    spanReplicateCommand: spanReplicateCommand,
    entityCreateCommand: entityCreateCommand,
    entityRemoveCommand: entityRemoveAndSpanRemeveIfNoEntityRestCommand,
    entityChangeTypeCommand: entityChangeTypeRemoveRelationCommand,
    relationCreateCommand: relationCreateAndSelectCommand,
    relationRemoveCommand: relationAndAssociatesRemoveCommand,
    relationChangeTypeCommand: (id, newType) => new ChangeTypeCommand(model, 'relation', id, newType),
    modificationCreateCommand: (modification) => new CreateCommand(model, 'modification', false, modification),
    modificationRemoveCommand: modificationRemoveCommand
  }

  return {
    invoke: function(commands) {
      if (commands && commands.length > 0) {
        invokeCommand.invoke(commands)
        history.push(commands)
      }
    },
    undo: function() {
      return function() {
        if (history.hasAnythingToUndo()) {
          model.selectionModel.clear()
          invokeCommand.invokeRevert(history.prev())
        }
      }
    }(),
    redo: function() {
      if (history.hasAnythingToRedo()) {
        model.selectionModel.clear()
        invokeCommand.invoke(history.next())
      }
    },
    factory: factory
  }
}
