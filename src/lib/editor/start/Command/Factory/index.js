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
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'
import TypeDefinitionChangeCommand from './TypeDefinitionChangeCommand'
import TypeDefinitionRemoveCommand from './TypeDefinitionRemoveCommand'
import AttributeChangeCommand from "./AttributeChangeCommand"
import attributeRemoveCommand from "./AttributeRemoveCommand"

export default function Factory(editor, annotationData, selectionModel) {
  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  const relationCreateCommand = (relation) => new CreateCommand(editor, annotationData, selectionModel, 'relation', true, relation),
    factory = {
      spanCreateCommand: (type, span) => spanAndTypesCreateCommand(editor, annotationData, selectionModel, span, [type]),
      spanRemoveCommand: (id) => spanRemoveCommand(editor, annotationData, selectionModel, id),
      spanMoveCommand: (spanId, newSpan) => spanMoveCommand(editor, annotationData, selectionModel, spanId, newSpan),
      spanReplicateCommand: (span, types, detectBoundaryFunc) => spanReplicateCommand(editor, annotationData, selectionModel, span, types, detectBoundaryFunc),
      entityCreateCommand: (entity) => new CreateCommand(editor, annotationData, selectionModel, 'entity', true, entity),
      entityRemoveCommand: (ids) => entityRemoveAndSpanRemeveIfNoEntityRestCommand(editor, annotationData, selectionModel, ids),
      entityChangeTypeCommand: (id, newType, isRemoveRelations) => entityChangeTypeRemoveRelationCommand(editor, annotationData, selectionModel, id, newType, isRemoveRelations),
      attributeCreateCommand: (attribute) => new CreateCommand(editor, annotationData, selectionModel, 'attribute', true, attribute),
      attributeRemoveCommand: (selectedEntities, pred, obj) => attributeRemoveCommand(editor, annotationData, selectionModel, selectedEntities, pred, obj),
      attributeChangeCommand: (id, selectedEntities, oldPred, oldObj, newPred, newObj) => new AttributeChangeCommand(annotationData, id, selectedEntities, oldPred, oldObj, newPred, newObj),
      relationCreateCommand: relationCreateCommand,
      relationRemoveCommand: (id) => relationAndAssociatesRemoveCommand(editor, annotationData, selectionModel, id),
      relationChangeTypeCommand: (id, newType) => new ChangeTypeCommand(editor, annotationData, 'relation', id, newType),
      modificationCreateCommand: (modification) => new CreateCommand(editor, annotationData, selectionModel, 'modification', false, modification),
      modificationRemoveCommand: (modification) => new RemoveCommand(editor, annotationData, selectionModel, 'modification', modification),
      typeDefinitionCreateCommand: (typeDefinition, newType) => new TypeDefinitionCreateCommand(editor, typeDefinition, newType),
      typeDefinitionChangeCommand: (typeDefinition, modelType, id, newType) => new TypeDefinitionChangeCommand(editor, annotationData, typeDefinition, modelType, id, newType, null),
      typeDefinitionRemoveCommand: (typeDefinition, removeType) => new TypeDefinitionRemoveCommand(editor, typeDefinition, removeType),
    }

  return factory
}
