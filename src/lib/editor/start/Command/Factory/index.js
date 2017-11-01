import {
  CreateCommand,
  RemoveCommand
}
from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'
import spanAndTypesCreateCommand from './spanAndTypesCreateCommand'
import spanReplicateCommand from './spanReplicateCommand'
import spanRemoveCommand from './spanRemoveCommand'
import spanMoveCommand from './spanMoveCommand'
import entityChangeTypeRemoveRelationCommand from './entityChangeTypeRemoveRelationCommand'
import entityRemoveAndSpanRemeveIfNoEntityRestCommand from './entityRemoveAndSpanRemeveIfNoEntityRestCommand'
import relationAndAssociatesRemoveCommand from './relationAndAssociatesRemoveCommand'
import TypeChangeLabelCommand from './TypeChangeLabelCommand'
import TypeCreateCommand from './TypeCreateCommand'

export default function Factory(editor, annotationData, selectionModel) {
  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  const relationCreateCommand = (relation) => new CreateCommand(annotationData, selectionModel, 'relation', true, relation),
    factory = {
      spanCreateCommand: (type, span) => spanAndTypesCreateCommand(editor, annotationData, selectionModel, span, [type]),
      spanRemoveCommand: (id) => spanRemoveCommand(annotationData, selectionModel, id),
      spanMoveCommand: (spanId, newSpan) => spanMoveCommand(editor, annotationData, selectionModel, spanId, newSpan),
      spanReplicateCommand: (span, types, detectBoundaryFunc) => spanReplicateCommand(editor, annotationData, selectionModel, span, types, detectBoundaryFunc),
      entityCreateCommand: (entity) => new CreateCommand(annotationData, selectionModel, 'entity', true, entity),
      entityRemoveCommand: (ids) => entityRemoveAndSpanRemeveIfNoEntityRestCommand(annotationData, selectionModel, ids),
      entityChangeTypeCommand: (id, newType, isRemoveRelations) => entityChangeTypeRemoveRelationCommand(annotationData, selectionModel, id, newType, isRemoveRelations),
      attributeRemoveCommand: (id) => new RemoveCommand(annotationData, selectionModel, 'attribute', id),
      attributeChangeTypeCommand: (id, newType) => new ChangeTypeCommand(annotationData, 'attribute', id, newType),
      relationCreateCommand: relationCreateCommand,
      relationRemoveCommand: (id) => relationAndAssociatesRemoveCommand(annotationData, selectionModel, id),
      relationChangeTypeCommand: (id, newType) => new ChangeTypeCommand(annotationData, 'relation', id, newType),
      modificationCreateCommand: (modification) => new CreateCommand(annotationData, selectionModel, 'modification', false, modification),
      modificationRemoveCommand: (modification) => new RemoveCommand(annotationData, selectionModel, 'modification', modification),
      typeCreateCommand: (typeContainer, id, label) => new TypeCreateCommand(typeContainer, id, label),
      typeChangeLabelCommand: (typeContainer, id, label) => new TypeChangeLabelCommand(typeContainer, id, label)
    }

  return factory
}
