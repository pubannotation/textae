import { CreateCommand } from './commandTemplate'
import AttatchModificationsToSelectedCommand from './AttatchModificationsToSelectedCommand'
import ChangeAttributeDefinitionAndRefectInstancesCommand from './ChangeAttributeDefinitionAndRefectInstancesCommand'
import ChangeAttributesOfSelectedEntitiesWithSamePred from './ChangeAttributesOfSelectedEntitiesWithSamePred'
import ChangeEntityTypeCommand from './ChangeEntityTypeCommand'
import ChangeRelationLabelCommand from './ChangeRelationLabelCommand'
import ChangeTypeDefinitionAndRefectInstancesCommand from './ChangeTypeDefinitionAndRefectInstancesCommand'
import ChangeTypeOfSelectedRelationsCommand from './ChangeTypeOfSelectedRelationsCommand'
import ChangeTypeRemoveRelationOfSelectedEntitiesCommand from './ChangeTypeRemoveRelationOfSelectedEntitiesCommand'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import CreateAttributeToSelectedEntitiesCommand from './CreateAttributeToSelectedEntitiesCommand'
import CreateDefaultTypeEntityToSelectedSpans from './CreateDefaultTypeEntityToSelectedSpans'
import CreateSpanAndAutoReplicateCommand from './CreateSpanAndAutoReplicateCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import MoveSpanCommand from './MoveSpanCommand'
import PasteTypesToSelectedSpansCommand from './PasteTypesToSelectedSpansCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import RemoveAttributesOfSelectedEntitiesByPredCommand from './RemoveAttributesOfSelectedEntitiesByPredCommand'
import RemoveModificationsFromSelectedCommand from './RemoveModificationsFromSelectedCommand'
import RemoveSelectedCommand from './RemoveSelectedCommand'
import RemoveSpanCommand from './RemoveSpanCommand'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import ToggleFlagAttributeToSelectedEntitiesCommand from './ToggleFlagAttributeToSelectedEntitiesCommand'

export default class {
  constructor(editor, annotationData, selectionModel, typeDefinition) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
  }

  changeAttributeDefinitionCommand(modelType, attrDef, changedProperties) {
    return new ChangeAttributeDefinitionAndRefectInstancesCommand(
      this._annotationData,
      this._typeDefinition[modelType],
      attrDef,
      changedProperties
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

  changeTypeDefinitionCommand(modelType, id, changedProperties) {
    return new ChangeTypeDefinitionAndRefectInstancesCommand(
      this._editor,
      this._annotationData,
      this._typeDefinition[modelType],
      modelType,
      id,
      changedProperties
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

  changeTypeRemoveRelationOfSelectedEntitiesCommand(newType) {
    return new ChangeTypeRemoveRelationOfSelectedEntitiesCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      newType
    )
  }

  createAttributeDefinitionCommand(modelType, attrDef) {
    return new CreateAttributeDefinitionCommand(
      this._typeDefinition[modelType],
      attrDef
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

  createDefaultTypeEntityToSelectedSpansCommand(type) {
    return new CreateDefaultTypeEntityToSelectedSpans(
      this._editor,
      this._annotationData,
      this._selectionModel,
      type
    )
  }

  createModificationCommand(modificationType, typeEditor) {
    return new AttatchModificationsToSelectedCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      modificationType,
      typeEditor
    )
  }

  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  createRelationCommand(relation) {
    return new CreateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      'relation',
      true,
      relation
    )
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

  createTypeDefinitionCommand(modelType, newType) {
    return new CreateTypeDefinitionCommand(
      this._editor,
      this._typeDefinition[modelType],
      newType
    )
  }

  deleteAttributeDefinitionCommand(modelType, attrDef) {
    return new DeleteAttributeDefinitionCommand(
      this._typeDefinition[modelType],
      attrDef
    )
  }

  moveSpanCommand(spanId, newSpan) {
    return new MoveSpanCommand(
      this._editor,
      this._annotationData,
      spanId,
      newSpan
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

  replicateSpanCommand(span, types, detectBoundaryFunc) {
    return new ReplicateSpanCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      span,
      types,
      detectBoundaryFunc
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

  removeModificationCommand(modificationType, typeEditor) {
    return new RemoveModificationsFromSelectedCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      modificationType,
      typeEditor
    )
  }

  removeSpanCommand(id) {
    return new RemoveSpanCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      id
    )
  }

  removeSelectedComand() {
    return new RemoveSelectedCommand(
      this._editor,
      this._annotationData,
      this._selectionModel
    )
  }

  removeTypeDefinitionCommand(modelType, removeType) {
    return new RemoveTypeDefinitionCommand(
      this._editor,
      this._typeDefinition[modelType],
      removeType
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
}
