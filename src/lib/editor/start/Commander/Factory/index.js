import { CreateCommand } from './commandTemplate'
import SpanReplicateCommand from './SpanReplicateCommand'
import SpanRemoveCommand from './SpanRemoveCommand'
import SpanMoveCommand from './SpanMoveCommand'
import RelationAndAssociatesRemoveCommand from './RelationAndAssociatesRemoveCommand'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'
import TypeDefinitionChangeAndRefectInstancesCommand from './TypeDefinitionChangeAndRefectInstancesCommand'
import TypeDefinitionRemoveCommand from './TypeDefinitionRemoveCommand'
import ChangeAttributesOfSelectedEntitiesCommand from './ChangeAttributesOfSelectedEntitiesCommand'
import AttatchModificationsToSelectedCommand from './AttatchModificationsToSelectedCommand'
import RemoveModificationsFromSelectedCommand from './RemoveModificationsFromSelectedCommand'
import ChangeTypeRemoveRelationOfSelectedEntitiesCommand from './ChangeTypeRemoveRelationOfSelectedEntitiesCommand'
import ChangeTypeOfSelectedRelationsCommand from './ChangeTypeOfSelectedRelationsCommand'
import RemoveSelectedCommand from './RemoveSelectedCommand'
import CreateDefaultTypeEntityToSelectedSpans from './CreateDefaultTypeEntityToSelectedSpans'
import PasteTypesToSelectedSpansCommand from './PasteTypesToSelectedSpansCommand'
import ChangeEntityTypeCommand from './ChangeEntityTypeCommand'
import ChangeRelationLabelCommand from './ChangeRelationLabelCommand'
import CreateSpanAndAutoReplicateCommand from './CreateSpanAndAutoReplicateCommand'
import ToggleFlagAttributeToSelectedEntitiesCommand from './ToggleFlagAttributeToSelectedEntitiesCommand'
import CreateAttributeToSelectedEntitiesCommand from './CreateAttributeToSelectedEntitiesCommand'
import ChangeAttributesOfSelectedEntitiesWithSamePred from './ChangeAttributesOfSelectedEntitiesWithSamePred'
import RemoveAttributesOfSelectedEntitiesByPredCommand from './RemoveAttributesOfSelectedEntitiesByPredCommand'

export default class {
  constructor(editor, annotationData, selectionModel, typeDefinition) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
  }

  createSpanAndAutoReplicateCommand(
    newSpan,
    isReplicateAuto,
    detectBountdaryFunc
  ) {
    return new CreateSpanAndAutoReplicateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      newSpan,
      this._typeDefinition.entity.defaultType,
      isReplicateAuto,
      detectBountdaryFunc
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

  changeTypeRemoveRelationOfSelectedEntitiesCommand(newType) {
    return new ChangeTypeRemoveRelationOfSelectedEntitiesCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      newType
    )
  }

  changeEntityTypeCommand(label, value, attributes, typeContainer) {
    return new ChangeEntityTypeCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      label,
      value,
      attributes,
      typeContainer
    )
  }

  createDefaultTypeEntityToSelectedSpansCommand(type) {
    return new CreateDefaultTypeEntityToSelectedSpans(
      this._editor,
      this._annotationData,
      this._selectionModel,
      type
    )
  }

  pasteTypesToSelectedSpansCommand(types) {
    return new PasteTypesToSelectedSpansCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      types
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

  changeAttributesOfSelectedEntitiesWithSamePred(attributeDefinition, newObj) {
    return new ChangeAttributesOfSelectedEntitiesWithSamePred(
      this._annotationData,
      this._selectionModel,
      attributeDefinition.pred,
      newObj
    )
  }

  toggleFlagAttributeToSelectedEntitiesCommand(attributeDefinition) {
    return new ToggleFlagAttributeToSelectedEntitiesCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      attributeDefinition
    )
  }

  removeAttributesOfSelectedEntitiesByPredCommand(attributeDefinition) {
    return new RemoveAttributesOfSelectedEntitiesByPredCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      attributeDefinition
    )
  }

  createAttributeToSelectedEntitiesCommand(attributeDefinition) {
    return new CreateAttributeToSelectedEntitiesCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      attributeDefinition
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

  changeRelationLabelCommand(label, value, typeContainer) {
    return new ChangeRelationLabelCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      label,
      value,
      typeContainer
    )
  }

  changeTypeOfSelectedRelationsCommand(selectedElements, newType) {
    return new ChangeTypeOfSelectedRelationsCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      selectedElements,
      newType
    )
  }

  removeSelectedComand() {
    return new RemoveSelectedCommand(
      this._editor,
      this._annotationData,
      this._selectionModel
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
