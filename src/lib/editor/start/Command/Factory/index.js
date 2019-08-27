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
import TypeModel from '../../../Model/AnnotationData/Container/SpanContainer/TypeModel'

export default class {
  constructor(editor, annotationData, selectionModel) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  spanCreateCommand(type, span) {
    return new SpanAndTypesCreateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      span,
      [new TypeModel(type)]
    )
  }

  spanRemoveCommand(id) {
    return new SpanRemoveCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      id
    )
  }

  spanMoveCommand(spanId, newSpan) {
    return new SpanMoveCommand(
      this._editor,
      this._annotationData,
      spanId,
      newSpan
    )
  }

  spanReplicateCommand(span, types, detectBoundaryFunc) {
    return new SpanReplicateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      span,
      types,
      detectBoundaryFunc
    )
  }

  entityCreateCommand(entity) {
    return new CreateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      'entity',
      true,
      entity
    )
  }

  entityRemoveCommand(ids) {
    return new EntityRemoveAndSpanRemeveIfNoEntityRestCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      ids
    )
  }

  entityChangeTypeCommand(id, newType, isRemoveRelations) {
    return new EntityChangeTypeRemoveRelationCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      id,
      newType,
      isRemoveRelations
    )
  }

  attributeCreateCommand(attribute) {
    return new CreateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      'attribute',
      true,
      attribute
    )
  }

  attributeRemoveCommand(selectedEntities, pred, obj) {
    return new RemoveAttributesOfSelectedEntitiesCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      selectedEntities,
      pred,
      obj
    )
  }

  attributeChangeCommand(
    id,
    selectedEntities,
    oldPred,
    oldObj,
    newPred,
    newObj
  ) {
    return new ChangeAttributesOfSelectedEntitiesCommand(
      this._annotationData,
      id,
      selectedEntities,
      oldPred,
      oldObj,
      newPred,
      newObj
    )
  }

  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  relationCreateCommand(relation) {
    return new CreateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      'relation',
      true,
      relation
    )
  }

  relationRemoveCommand(id) {
    return new RelationAndAssociatesRemoveCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      id
    )
  }

  relationChangeTypeCommand(id, newType) {
    return new ChangeTypeCommand(
      this._editor,
      this._annotationData,
      'relation',
      id,
      newType
    )
  }

  modificationCreateCommand(modificationType, typeEditor) {
    return new AttatchModificationsToSelectedCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      modificationType,
      typeEditor
    )
  }

  modificationRemoveCommand(modificationType, typeEditor) {
    return new RemoveModificationsFromSelectedCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      modificationType,
      typeEditor
    )
  }

  typeDefinitionCreateCommand(typeDefinition, newType) {
    return new TypeDefinitionCreateCommand(
      this._editor,
      typeDefinition,
      newType
    )
  }

  typeDefinitionChangeCommand(
    typeDefinition,
    modelType,
    id,
    changedProperties
  ) {
    return new TypeDefinitionChangeAndRefectInstancesCommand(
      this._editor,
      this._annotationData,
      typeDefinition,
      modelType,
      id,
      changedProperties
    )
  }

  typeDefinitionRemoveCommand(typeDefinition, removeType) {
    return new TypeDefinitionRemoveCommand(
      this._editor,
      typeDefinition,
      removeType
    )
  }
}
