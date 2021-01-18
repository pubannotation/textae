import { CreateCommand } from './commandTemplate'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ChangeAttributeDefinitionAndRefectInstancesCommand from './ChangeAttributeDefinitionAndRefectInstancesCommand'
import ChangeAttributesOfSelectedEntitiesWithSamePred from './ChangeAttributesOfSelectedEntitiesWithSamePred'
import ChangeItemTypeCommand from './ChangeItemTypeCommand'
import ChangeTypeDefinitionAndRefectInstancesCommand from './ChangeTypeDefinitionAndRefectInstancesCommand'
import ChangeTypeOfSelectedItemsCommand from './ChangeTypeOfSelectedItemsCommand'
import ChangeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand from './ChangeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import CreateAttributeToSelectedEntitiesCommand from './CreateAttributeToSelectedEntitiesCommand'
import CreateBlockSpanCommand from './CreateBlockSpanCommand'
import CreateDefaultTypeEntityToSelectedSpansCommand from './CreateDefaultTypeEntityToSelectedSpansCommand'
import CreateSpanAndAutoReplicateCommand from './CreateSpanAndAutoReplicateCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import MoveAttributeDefinitionCommand from './MoveAttributeDefinitionCommand'
import MoveBlockSpanCommand from './MoveBlockSpanCommand'
import MoveDenotationSpanCommand from './MoveDenotationSpanCommand'
import MoveEntitiesToSelectedSpansCommand from './MoveEntitiesToSelectedSpansCommand'
import PasteTypesToSelectedSpansCommand from './PasteTypesToSelectedSpansCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import RemoveAttributesOfSelectedEntitiesByPredCommand from './RemoveAttributesOfSelectedEntitiesByPredCommand'
import RemoveSelectedCommand from './RemoveSelectedCommand'
import RemoveSpanCommand from './RemoveSpanCommand'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ToggleFlagAttributeToSelectedEntitiesCommand from './ToggleFlagAttributeToSelectedEntitiesCommand'

export default class Factory {
  constructor(editor, annotationData, selectionModel) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  addValueToAttributeDefinitionCommand(attributeDefinition, value) {
    return new AddValueToAttributeDefinitionCommand(
      this._annotationData.typeDefinition.attribute,
      attributeDefinition.JSON,
      value
    )
  }

  changeAttributeDefinitionCommand(attributeDefinition, changedProperties) {
    return new ChangeAttributeDefinitionAndRefectInstancesCommand(
      this._annotationData,
      this._annotationData.typeDefinition.attribute,
      attributeDefinition,
      changedProperties
    )
  }

  changeAttributesOfSelectedEntitiesWithSamePred(
    attributeDefinition,
    newObj,
    newLabel
  ) {
    return new ChangeAttributesOfSelectedEntitiesWithSamePred(
      this._annotationData,
      this._selectionModel,
      this._annotationData.typeDefinition.attribute,
      attributeDefinition,
      newObj,
      newLabel
    )
  }

  changeItemTypeCommand(label, value, typeContainer, attributes) {
    return new ChangeItemTypeCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      label,
      value,
      typeContainer,
      attributes
    )
  }

  changeTypeDefinitionCommand(
    typeContainer,
    annotationType,
    id,
    changedProperties
  ) {
    return new ChangeTypeDefinitionAndRefectInstancesCommand(
      this._editor,
      this._annotationData,
      typeContainer,
      annotationType,
      id,
      changedProperties
    )
  }

  changeTypeOfSelectedRelationsCommand(newType) {
    return new ChangeTypeOfSelectedItemsCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      'relation',
      newType
    )
  }

  changeTypeOfSelectedEntitiesCommand(newType) {
    return new ChangeTypeOfSelectedItemsCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      'entity',
      newType
    )
  }

  changeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand(
    attributeDefinition,
    index,
    value
  ) {
    return new ChangeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand(
      this._annotationData,
      this._annotationData.typeDefinition.attribute,
      attributeDefinition,
      index,
      value
    )
  }

  createAttributeDefinitionCommand(attributeDefinition) {
    return new CreateAttributeDefinitionCommand(
      this._annotationData.typeDefinition.attribute,
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

  createBlockSpanCommand(newSpan) {
    return new CreateBlockSpanCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      newSpan.begin,
      newSpan.end,
      this._annotationData.typeDefinition.block.defaultType
    )
  }

  createDefaultTypeEntityToSelectedSpansCommand(typeName) {
    return new CreateDefaultTypeEntityToSelectedSpansCommand(
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

  createSpanAndAutoReplicateCommand(newSpan, isReplicateAuto, isDelimiterFunc) {
    return new CreateSpanAndAutoReplicateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      newSpan,
      this._annotationData.typeDefinition.denotation.defaultType,
      isReplicateAuto,
      isDelimiterFunc
    )
  }

  createTypeDefinitionCommand(typeContainer, newType) {
    return new CreateTypeDefinitionCommand(this._editor, typeContainer, newType)
  }

  deleteAttributeDefinitionCommand(attributeDefinition) {
    return new DeleteAttributeDefinitionCommand(
      this._annotationData.typeDefinition.attribute,
      attributeDefinition
    )
  }

  moveAttributeDefintionComannd(oldIndex, newIndex) {
    return new MoveAttributeDefinitionCommand(
      this._annotationData.typeDefinition.attribute,
      oldIndex,
      newIndex
    )
  }

  moveBlockSpanCommand(spanId, begin, end) {
    return new MoveBlockSpanCommand(this._annotationData, spanId, begin, end)
  }

  moveDenotationSpanCommand(spanId, begin, end) {
    return new MoveDenotationSpanCommand(
      this._annotationData,
      spanId,
      begin,
      end
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

  pasteTypesToSelectedSpansCommand(typeValuesList) {
    return new PasteTypesToSelectedSpansCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      typeValuesList
    )
  }

  replicateSpanCommand(span, typeValuesList, isDelimiterFunc) {
    return new ReplicateSpanCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      span,
      typeValuesList,
      isDelimiterFunc
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

  removeTypeDefinitionCommand(typeContainer, removeType) {
    return new RemoveTypeDefinitionCommand(
      this._editor,
      typeContainer,
      removeType
    )
  }

  removeValueFromAttributeDefinitionCommand(attributeDefinition, index) {
    return new RemoveValueFromAttributeDefinitionCommand(
      this._annotationData.typeDefinition.attribute,
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
