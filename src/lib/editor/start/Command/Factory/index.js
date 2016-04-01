import {
  CreateCommand, RemoveCommand
}
from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'
import spanAndDefaultEntryCreateCommand from './spanAndDefaultEntryCreateCommand'
import spanReplicateCommand from './spanReplicateCommand'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import spanRemoveCommand from './spanRemoveCommand'
import spanMoveCommand from './spanMoveCommand'
import entityChangeTypeRemoveRelationCommand from './entityChangeTypeRemoveRelationCommand'
import entityRemoveAndSpanRemeveIfNoEntityRestCommand from './entityRemoveAndSpanRemeveIfNoEntityRestCommand'
import relationAndAssociatesRemoveCommand from './relationAndAssociatesRemoveCommand'
import TypeChangeLabelCommand from './TypeChangeLabelCommand'
import TypeCreateCommand from './TypeCreateCommand'

export default function Factory(editor, model) {
  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  const relationCreateCommand = (relation) => new CreateCommand(model.annotationData, model.selectionModel, 'relation', false, relation),
    factory = {
      spanCreateCommand: (type, span) => spanAndDefaultEntryCreateCommand(editor, model, type, span),
      spanRemoveCommand: (id) => spanRemoveCommand(model, id),
      spanMoveCommand: (spanId, newSpan) => spanMoveCommand(editor, model, spanId, newSpan),
      spanReplicateCommand: (type, span, detectBoundaryFunc) => spanReplicateCommand(editor, model, type, span, detectBoundaryFunc),
      entityCreateCommand: (entity) => new CreateCommand(model.annotationData, model.selectionModel, 'entity', true, entity),
      entityRemoveCommand: (ids) => entityRemoveAndSpanRemeveIfNoEntityRestCommand(model, ids),
      entityChangeTypeCommand: (id, newType, isRemoveRelations) => entityChangeTypeRemoveRelationCommand(model, id, newType, isRemoveRelations),
      relationCreateCommand: relationCreateCommand,
      relationRemoveCommand: (id) => relationAndAssociatesRemoveCommand(model, id),
      relationChangeTypeCommand: (id, newType) => new ChangeTypeCommand(model.annotationData, 'relation', id, newType),
      modificationCreateCommand: (modification) => new CreateCommand(model.annotationData, model.selectionModel, 'modification', false, modification),
      modificationRemoveCommand: (modification) => new RemoveCommand(model.annotationData, model.selectionModel, 'modification', modification),
      typeCreateCommand: (typeContainer, id, label) => new TypeCreateCommand(typeContainer, id, label),
      typeChangeLabelCommand: (typeContainer, id, label) => new TypeChangeLabelCommand(typeContainer, id, label)
    }

  return factory
}
