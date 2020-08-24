import { CreateCommand } from './commandTemplate'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ChangeAttributeDefinitionAndRefectInstancesCommand from './ChangeAttributeDefinitionAndRefectInstancesCommand'
import ChangeAttributesOfSelectedEntitiesWithSamePred from './ChangeAttributesOfSelectedEntitiesWithSamePred'
import ChangeEntityTypeCommand from './ChangeEntityTypeCommand'
import ChangeRelationLabelCommand from './ChangeRelationLabelCommand'
import ChangeTypeDefinitionAndRefectInstancesCommand from './ChangeTypeDefinitionAndRefectInstancesCommand'
import ChangeTypeOfSelectedRelationsCommand from './ChangeTypeOfSelectedRelationsCommand'
import ChangeTypeOfSelectedEntitiesCommand from './ChangeTypeOfSelectedEntitiesCommand'
import ChangeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand from './ChangeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import CreateAttributeToSelectedEntitiesCommand from './CreateAttributeToSelectedEntitiesCommand'
import CreateDefaultTypeEntityToSelectedSpans from './CreateDefaultTypeEntityToSelectedSpans'
import CreateSpanAndAutoReplicateCommand from './CreateSpanAndAutoReplicateCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import MoveAttributeDefinitionCommand from './MoveAttributeDefinitionCommand'
import MoveSpanCommand from './MoveSpanCommand'
import PasteTypesToSelectedSpansCommand from './PasteTypesToSelectedSpansCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import RemoveAttributesOfSelectedEntitiesByPredCommand from './RemoveAttributesOfSelectedEntitiesByPredCommand'
import RemoveSelectedCommand from './RemoveSelectedCommand'
import RemoveSpanCommand from './RemoveSpanCommand'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ToggleFlagAttributeToSelectedEntitiesCommand from './ToggleFlagAttributeToSelectedEntitiesCommand'
import MoveEntitiesToSelectedSpansCommand from './MoveEntitiesToSelectedSpansCommand'

export default class {
  constructor(editor, annotationData, selectionModel, typeDefinition) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
  }

  addValueToAttributeDefinitionCommand(modelType, attributeDefinition, value) {
    return new AddValueToAttributeDefinitionCommand(
      this._typeDefinition[modelType],
      attributeDefinition.JSON,
      value
    )
  }

  changeAttributeDefinitionCommand(
    modelType,
    attributeDefinition,
    changedProperties
  ) {
    return new ChangeAttributeDefinitionAndRefectInstancesCommand(
      this._annotationData,
      this._typeDefinition[modelType],
      attributeDefinition,
      changedProperties
    )
  }

  changeAttributesOfSelectedEntitiesWithSamePred(
    modelType,
    attributeDefinition,
    newObj,
    newLabel
  ) {
    return new ChangeAttributesOfSelectedEntitiesWithSamePred(
      this._annotationData,
      this._selectionModel,
      this._typeDefinition[modelType],
      attributeDefinition,
      newObj,
      newLabel
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

  changeTypeOfSelectedEntitiesCommand(newType) {
    return new ChangeTypeOfSelectedEntitiesCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      newType
    )
  }

  changeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand(
    modelType,
    attributeDefinition,
    index,
    value
  ) {
    return new ChangeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand(
      this._annotationData,
      this._typeDefinition[modelType],
      attributeDefinition,
      index,
      value
    )
  }

  createAttributeDefinitionCommand(modelType, attributeDefinition) {
    return new CreateAttributeDefinitionCommand(
      this._typeDefinition[modelType],
      attributeDefinition
    )
  }

  createAttributeToSelectedEntitiesCommand(attributeDefinition, obj = null) {
    return new CreateAttributeToSelectedEntitiesCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      attributeDefinition,
      obj
    )
  }

  createDefaultTypeEntityToSelectedSpansCommand(typeName) {
    return new CreateDefaultTypeEntityToSelectedSpans(
      this._editor,
      this._annotationData,
      this._selectionModel,
      typeName
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

  deleteAttributeDefinitionCommand(modelType, attributeDefinition) {
    return new DeleteAttributeDefinitionCommand(
      this._typeDefinition[modelType],
      attributeDefinition
    )
  }

  moveAttributeDefintionComannd(oldIndex, newIndex) {
    return new MoveAttributeDefinitionCommand(
      this._typeDefinition.entity,
      oldIndex,
      newIndex
    )
  }

  moveEntitiesToSelectedSpansCommand(entities) {
    return new MoveEntitiesToSelectedSpansCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      entities
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

  removeValueFromAttributeDefinitionCommand(
    modelType,
    attributeDefinition,
    index
  ) {
    return new RemoveValueFromAttributeDefinitionCommand(
      this._typeDefinition[modelType],
      attributeDefinition.JSON,
      index
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
