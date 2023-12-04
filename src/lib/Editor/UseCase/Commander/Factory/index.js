import { CreateCommand } from './commandTemplate'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ChangeAttributeDefinitionAndRefectInstancesCommand from './ChangeAttributeDefinitionAndRefectInstancesCommand'
import ChangeAttributeObjOfItemsCommand from './ChangeAttributeObjOfItemsCommand'
import ChangeStringAttributeObjOfItemsCommand from './ChangeStringAttributeObjOfItemsCommand'
import ChangeTypeValuesCommand from './ChangeTypeValuesCommand'
import ChangeTypeDefinitionAndRefectInstancesCommand from './ChangeTypeDefinitionAndRefectInstancesCommand'
import ChangeTypeOfSelectedItemsCommand from './ChangeTypeOfSelectedItemsCommand'
import ChangeValueOfAttributeDefinitionAndObjectOfAttributeCommand from './ChangeValueOfAttributeDefinitionAndObjectOfAttributeCommand'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import CreateAttributeToItemsCommand from './CreateAttributeToItemsCommand'
import CreateBlockSpanCommand from './CreateBlockSpanCommand'
import CreateDefaultTypeEntityToSelectedSpansCommand from './CreateDefaultTypeEntityToSelectedSpansCommand'
import CreateSpanAndAutoReplicateCommand from './CreateSpanAndAutoReplicateCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import MoveAttributeDefinitionCommand from './MoveAttributeDefinitionCommand'
import MoveBlockSpanCommand from './MoveBlockSpanCommand'
import MoveDenotationSpanCommand from './MoveDenotationSpanCommand'
import MoveEntitiesToSelectedSpanCommand from './MoveEntitiesToSelectedSpanCommand'
import PasteTypesToSelectedSpansCommand from './PasteTypesToSelectedSpansCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import RemoveAttributesFromItemsByPredCommand from './RemoveAttributesFromItemsByPredCommand'
import RemoveSelectedCommand from './RemoveSelectedCommand'
import RemoveSpanCommand from './RemoveSpanCommand'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ToggleFlagAttributeToItemsCommand from './ToggleFlagAttributeToItemsCommand'

export default class Factory {
  constructor(editorID, eventEmitter, annotationModel, selectionModel) {
    this._editorID = editorID
    this._eventEmitter = eventEmitter
    this._annotationModel = annotationModel
    this._selectionModel = selectionModel
  }

  addValueToAttributeDefinitionCommand(attributeDefinition, value) {
    return new AddValueToAttributeDefinitionCommand(
      this._annotationModel.typeDefinition.attribute,
      attributeDefinition,
      value
    )
  }

  changeAttributeDefinitionCommand(attributeDefinition, changedProperties) {
    return new ChangeAttributeDefinitionAndRefectInstancesCommand(
      this._eventEmitter,
      this._annotationModel,
      this._annotationModel.typeDefinition.attribute,
      attributeDefinition,
      changedProperties
    )
  }

  changeAttributeObjOfItemsCommand(items, attributeDefinition, newObj) {
    return new ChangeAttributeObjOfItemsCommand(
      this._eventEmitter,
      this._annotationModel,
      items,
      attributeDefinition,
      newObj
    )
  }

  changeStringAttributeObjOfItemsCommand(
    items,
    attributeDefinition,
    newObj,
    newLabel
  ) {
    return new ChangeStringAttributeObjOfItemsCommand(
      this._eventEmitter,
      this._annotationModel,
      this._annotationModel.typeDefinition.attribute,
      items,
      attributeDefinition,
      newObj,
      newLabel
    )
  }

  changeTypeValuesCommand(label, value, definitionContainer, attributes) {
    return new ChangeTypeValuesCommand(
      this._annotationModel,
      this._selectionModel,
      label,
      value,
      definitionContainer,
      attributes
    )
  }

  changeTypeDefinitionCommand(
    definitionContainer,
    annotationType,
    id,
    changedProperties
  ) {
    return new ChangeTypeDefinitionAndRefectInstancesCommand(
      this._annotationModel,
      definitionContainer,
      annotationType,
      id,
      changedProperties
    )
  }

  changeTypeOfSelectedItemsCommand(annotationType, newType) {
    return new ChangeTypeOfSelectedItemsCommand(
      this._annotationModel,
      this._selectionModel,
      annotationType,
      newType
    )
  }

  changeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand(
    attributeDefinition,
    index,
    value
  ) {
    return new ChangeValueOfAttributeDefinitionAndObjectOfAttributeCommand(
      this._eventEmitter,
      this._annotationModel,
      this._annotationModel.typeDefinition.attribute,
      attributeDefinition,
      index,
      value
    )
  }

  createAttributeDefinitionCommand(attributeDefinition) {
    return new CreateAttributeDefinitionCommand(
      this._annotationModel.typeDefinition.attribute,
      attributeDefinition
    )
  }

  createAttributeToItemsCommand(items, attributeDefinition, obj = null) {
    return new CreateAttributeToItemsCommand(
      this._annotationModel,
      items,
      attributeDefinition,
      obj
    )
  }

  createBlockSpanCommand(newSpan) {
    return new CreateBlockSpanCommand(
      this._editorID,
      this._annotationModel,
      this._selectionModel,
      newSpan.begin,
      newSpan.end,
      this._annotationModel.typeDefinition.block.defaultType
    )
  }

  createDefaultTypeEntityToSelectedSpansCommand(typeName) {
    return new CreateDefaultTypeEntityToSelectedSpansCommand(
      this._annotationModel,
      this._selectionModel,
      typeName
    )
  }

  createRelationCommand(relation) {
    return new CreateCommand(
      this._annotationModel,
      'relation',
      relation,
      this._selectionModel
    )
  }

  createSpanAndAutoReplicateCommand(newSpan, isReplicateAuto, isDelimiterFunc) {
    return new CreateSpanAndAutoReplicateCommand(
      this._editorID,
      this._annotationModel,
      this._selectionModel,
      newSpan,
      this._annotationModel.typeDefinition.denotation.defaultType,
      isReplicateAuto,
      isDelimiterFunc
    )
  }

  createTypeDefinitionCommand(definitionContainer, newType) {
    return new CreateTypeDefinitionCommand(definitionContainer, newType)
  }

  deleteAttributeDefinitionCommand(attributeDefinition) {
    return new DeleteAttributeDefinitionCommand(
      this._annotationModel.typeDefinition.attribute,
      attributeDefinition
    )
  }

  moveAttributeDefintionComannd(oldIndex, newIndex) {
    return new MoveAttributeDefinitionCommand(
      this._annotationModel.typeDefinition.attribute,
      oldIndex,
      newIndex
    )
  }

  moveBlockSpanCommand(spanId, begin, end) {
    return new MoveBlockSpanCommand(this._annotationModel, spanId, begin, end)
  }

  moveDenotationSpanCommand(spanId, begin, end) {
    return new MoveDenotationSpanCommand(
      this._annotationModel,
      spanId,
      begin,
      end
    )
  }

  moveEntitiesToSelectedSpanCommand(entities) {
    return new MoveEntitiesToSelectedSpanCommand(
      this._annotationModel,
      this._selectionModel,
      entities
    )
  }

  pasteTypesToSelectedSpansCommand(
    typeValuesList,
    newTypes = [],
    attrDefs = [],
    newSelectionAttributeObjects = []
  ) {
    return new PasteTypesToSelectedSpansCommand(
      this._annotationModel,
      this._selectionModel,
      typeValuesList,
      newTypes,
      attrDefs,
      newSelectionAttributeObjects
    )
  }

  replicateSpanCommand(span, typeValuesList, isDelimiterFunc) {
    return new ReplicateSpanCommand(
      this._editorID,
      this._annotationModel,
      this._selectionModel,
      span,
      typeValuesList,
      isDelimiterFunc
    )
  }

  removeAttributesFromItemsByPredCommand(items, attributeDefinition) {
    return new RemoveAttributesFromItemsByPredCommand(
      this._annotationModel,
      items,
      attributeDefinition
    )
  }

  removeSpanCommand(id) {
    return new RemoveSpanCommand(this._annotationModel, id)
  }

  removeSelectedComand() {
    return new RemoveSelectedCommand(
      this._annotationModel,
      this._selectionModel
    )
  }

  removeTypeDefinitionCommand(definitionContainer, removeType) {
    return new RemoveTypeDefinitionCommand(definitionContainer, removeType)
  }

  removeValueFromAttributeDefinitionCommand(attributeDefinition, index) {
    return new RemoveValueFromAttributeDefinitionCommand(
      this._annotationModel.typeDefinition.attribute,
      attributeDefinition,
      index
    )
  }

  toggleFlagAttributeToItemsCommand(items, attributeDefinition) {
    return new ToggleFlagAttributeToItemsCommand(
      this._annotationModel,
      items,
      attributeDefinition
    )
  }
}
