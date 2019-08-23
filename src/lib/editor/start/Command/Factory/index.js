import { CreateCommand } from './commandTemplate'
import ChangeTypeCommand from './ChangeTypeCommand'
import SpanAndTypesCreateCommand from './SpanAndTypesCreateCommand'
import SpanReplicateCommand from './SpanReplicateCommand'
import SpanRemoveCommand from './SpanRemoveCommand'
import SpanMoveCommand from './SpanMoveCommand'
import EntityChangeTypeRemoveRelationCommand from './EntityChangeTypeRemoveRelationCommand'
import EntityRemoveAndSpanRemeveIfNoEntityRestCommand from './EntityRemoveAndSpanRemeveIfNoEntityRestCommand'
import RelationAndAssociatesRemoveCommand from './RelationAndAssociatesRemoveCommand'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'
import TypeDefinitionChangeAndRefectInstancesCommand from './TypeDefinitionChangeAndRefectInstancesCommand'
import TypeDefinitionRemoveCommand from './TypeDefinitionRemoveCommand'
import ChangeAttributesOfSelectedEntitiesCommand from './ChangeAttributesOfSelectedEntitiesCommand'
import RemoveAttributesOfSelectedEntitiesCommand from './RemoveAttributesOfSelectedEntitiesCommand'
import AttatchModificationsToSelectedCommand from './AttatchModificationsToSelectedCommand'
import RemoveModificationsFromSelectedCommand from './RemoveModificationsFromSelectedCommand'

export default function Factory(editor, annotationData, selectionModel) {
  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  const relationCreateCommand = (relation) =>
    new CreateCommand(
      editor,
      annotationData,
      selectionModel,
      'relation',
      true,
      relation
    )
  const factory = {
    spanCreateCommand: (type, span) => {
      return new SpanAndTypesCreateCommand(
        editor,
        annotationData,
        selectionModel,
        span,
        [{ name: type }]
      )
    },
    spanRemoveCommand: (id) =>
      new SpanRemoveCommand(editor, annotationData, selectionModel, id),
    spanMoveCommand: (spanId, newSpan) =>
      new SpanMoveCommand(editor, annotationData, spanId, newSpan),
    spanReplicateCommand: (span, types, detectBoundaryFunc) =>
      new SpanReplicateCommand(
        editor,
        annotationData,
        selectionModel,
        span,
        types,
        detectBoundaryFunc
      ),
    entityCreateCommand: (entity) =>
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'entity',
        true,
        entity
      ),
    entityRemoveCommand: (ids) =>
      new EntityRemoveAndSpanRemeveIfNoEntityRestCommand(
        editor,
        annotationData,
        selectionModel,
        ids
      ),
    entityChangeTypeCommand: (id, newType, isRemoveRelations) =>
      new EntityChangeTypeRemoveRelationCommand(
        editor,
        annotationData,
        selectionModel,
        id,
        newType,
        isRemoveRelations
      ),
    attributeCreateCommand: (attribute) =>
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        true,
        attribute
      ),
    attributeRemoveCommand: (selectedEntities, pred, obj) =>
      new RemoveAttributesOfSelectedEntitiesCommand(
        editor,
        annotationData,
        selectionModel,
        selectedEntities,
        pred,
        obj
      ),
    attributeChangeCommand: (
      id,
      selectedEntities,
      oldPred,
      oldObj,
      newPred,
      newObj
    ) =>
      new ChangeAttributesOfSelectedEntitiesCommand(
        annotationData,
        id,
        selectedEntities,
        oldPred,
        oldObj,
        newPred,
        newObj
      ),
    relationCreateCommand,
    relationRemoveCommand: (id) =>
      new RelationAndAssociatesRemoveCommand(
        editor,
        annotationData,
        selectionModel,
        id
      ),
    relationChangeTypeCommand: (id, newType) =>
      new ChangeTypeCommand(editor, annotationData, 'relation', id, newType),
    modificationCreateCommand: (modificationType, typeEditor) =>
      new AttatchModificationsToSelectedCommand(
        editor,
        selectionModel,
        annotationData,
        modificationType,
        typeEditor
      ),
    modificationRemoveCommand: (modificationType, typeEditor) =>
      new RemoveModificationsFromSelectedCommand(
        editor,
        selectionModel,
        annotationData,
        modificationType,
        typeEditor
      ),
    typeDefinitionCreateCommand: (typeDefinition, newType) =>
      new TypeDefinitionCreateCommand(editor, typeDefinition, newType),
    typeDefinitionChangeCommand: (
      typeDefinition,
      modelType,
      id,
      changedProperties
    ) =>
      new TypeDefinitionChangeAndRefectInstancesCommand(
        editor,
        annotationData,
        typeDefinition,
        modelType,
        id,
        changedProperties
      ),
    typeDefinitionRemoveCommand: (typeDefinition, removeType) =>
      new TypeDefinitionRemoveCommand(editor, typeDefinition, removeType)
  }

  return factory
}
