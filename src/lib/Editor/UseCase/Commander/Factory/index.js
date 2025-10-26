import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ChangeAttributeDefinitionAndReflectInstancesCommand from './ChangeAttributeDefinitionAndReflectInstancesCommand'
import ChangeAttributeObjOfItemsCommand from './ChangeAttributeObjOfItemsCommand'
import ChangeStringAttributeObjOfItemsCommand from './ChangeStringAttributeObjOfItemsCommand'
import ChangeTextAndMoveSpanCommand from './ChangeTextAndMoveSpanCommand'
import ChangeTypeDefinitionAndReflectInstancesCommand from './ChangeTypeDefinitionAndReflectInstancesCommand'
import ChangeTypeOfSelectedItemsCommand from './ChangeTypeOfSelectedItemsCommand'
import ChangeTypeValuesCommand from './ChangeTypeValuesCommand'
import ChangeValueOfAttributeDefinitionAndObjectOfAttributeCommand from './ChangeValueOfAttributeDefinitionAndObjectOfAttributeCommand'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import CreateAttributeToItemsCommand from './CreateAttributeToItemsCommand'
import CreateBlockSpanCommand from './CreateBlockSpanCommand'
import CreateDefaultTypeEntityToSelectedSpansCommand from './CreateDefaultTypeEntityToSelectedSpansCommand'
import CreateSpanAndAutoReplicateCommand from './CreateSpanAndAutoReplicateCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import { CreateCommand } from './commandTemplate'
import DeleteAttributeDefinitionCommand from './DeleteAttributeDefinitionCommand'
import MoveAttributeDefinitionCommand from './MoveAttributeDefinitionCommand'
import MoveBlockSpanCommand from './MoveBlockSpanCommand'
import MoveDenotationSpanCommand from './MoveDenotationSpanCommand'
import MoveEntitiesToSelectedDenotationSpanCommand from './MoveEntitiesToSelectedDenotationSpanCommand'
import PasteTypesToSelectedDenotationSpansCommand from './PasteTypesToSelectedDenotationSpansCommand'
import RemoveAttributesFromItemsByPredCommand from './RemoveAttributesFromItemsByPredCommand'
import RemoveSelectedCommand from './RemoveSelectedCommand'
import RemoveSpanCommand from './RemoveSpanCommand'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import ToggleFlagAttributeToItemsCommand from './ToggleFlagAttributeToItemsCommand'

export default class Factory {
  #editorID
  #eventEmitter
  /** @type {import('../../../AnnotationModel').default} */
  #annotationModel
  #selectionModel

  constructor(editorID, eventEmitter, annotationModel, selectionModel) {
    this.#editorID = editorID
    this.#eventEmitter = eventEmitter
    this.#annotationModel = annotationModel
    this.#selectionModel = selectionModel
  }

  addValueToAttributeDefinitionCommand(attributeDefinition, value) {
    return new AddValueToAttributeDefinitionCommand(
      this.#annotationModel.typeDictionary.attribute,
      attributeDefinition,
      value
    )
  }

  changeAttributeDefinitionCommand(attributeDefinition, changedProperties) {
    return new ChangeAttributeDefinitionAndReflectInstancesCommand(
      this.#eventEmitter,
      this.#annotationModel,
      this.#annotationModel.typeDictionary.attribute,
      attributeDefinition,
      changedProperties
    )
  }

  changeAttributeObjOfItemsCommand(items, attributeDefinition, newObj) {
    return new ChangeAttributeObjOfItemsCommand(
      this.#eventEmitter,
      this.#annotationModel,
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
      this.#eventEmitter,
      this.#annotationModel,
      this.#annotationModel.typeDictionary.attribute,
      items,
      attributeDefinition,
      newObj,
      newLabel
    )
  }

  changeTypeValuesCommand(label, value, definitionContainer, attributes) {
    return new ChangeTypeValuesCommand(
      this.#annotationModel,
      this.#selectionModel,
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
    return new ChangeTypeDefinitionAndReflectInstancesCommand(
      this.#annotationModel,
      definitionContainer,
      annotationType,
      id,
      changedProperties
    )
  }

  changeTypeOfSelectedItemsCommand(annotationType, newType) {
    return new ChangeTypeOfSelectedItemsCommand(
      this.#annotationModel,
      this.#selectionModel,
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
      this.#eventEmitter,
      this.#annotationModel,
      this.#annotationModel.typeDictionary.attribute,
      attributeDefinition,
      index,
      value
    )
  }

  createAttributeDefinitionCommand(attributeDefinition) {
    return new CreateAttributeDefinitionCommand(
      this.#annotationModel.typeDictionary.attribute,
      attributeDefinition
    )
  }

  createAttributeToItemsCommand(items, attributeDefinition, obj = null) {
    return new CreateAttributeToItemsCommand(
      this.#annotationModel,
      items,
      attributeDefinition,
      obj
    )
  }

  createBlockSpanCommand(newSpan) {
    return new CreateBlockSpanCommand(
      this.#editorID,
      this.#annotationModel,
      this.#selectionModel,
      newSpan.begin,
      newSpan.end,
      this.#annotationModel.typeDictionary.block.defaultType
    )
  }

  createDefaultTypeEntityToSelectedSpansCommand(typeName) {
    return new CreateDefaultTypeEntityToSelectedSpansCommand(
      this.#annotationModel,
      this.#selectionModel,
      typeName
    )
  }

  createRelationCommand(relation) {
    return new CreateCommand(
      this.#annotationModel,
      'relation',
      relation,
      this.#selectionModel
    )
  }

  createSpanAndAutoReplicateCommand(newSpan, isReplicateAuto, isDelimiterFunc) {
    return new CreateSpanAndAutoReplicateCommand(
      this.#editorID,
      this.#annotationModel,
      this.#selectionModel,
      newSpan,
      this.#annotationModel.typeDictionary.denotation.defaultType,
      isReplicateAuto,
      isDelimiterFunc
    )
  }

  createTypeDefinitionCommand(definitionContainer, newType) {
    return new CreateTypeDefinitionCommand(definitionContainer, newType)
  }

  deleteAttributeDefinitionCommand(attributeDefinition) {
    return new DeleteAttributeDefinitionCommand(
      this.#annotationModel.typeDictionary.attribute,
      attributeDefinition
    )
  }

  moveAttributeDefinitionCommand(oldIndex, newIndex) {
    return new MoveAttributeDefinitionCommand(
      this.#annotationModel.typeDictionary.attribute,
      oldIndex,
      newIndex
    )
  }

  moveBlockSpanCommand(spanId, beginAfterMove, endAfterMove) {
    const { begin, end } = this.#annotationModel.getSpan(spanId)

    return new MoveBlockSpanCommand(
      this.#annotationModel.spanInstanceContainer,
      begin,
      end,
      beginAfterMove,
      endAfterMove
    )
  }

  moveDenotationSpanCommand(spanId, beginAfterMove, endAfterMove) {
    const { begin, end } = this.#annotationModel.getSpan(spanId)

    return new MoveDenotationSpanCommand(
      this.#annotationModel.spanInstanceContainer,
      begin,
      end,
      beginAfterMove,
      endAfterMove
    )
  }

  moveEntitiesToSelectedSpanCommand(entities) {
    return new MoveEntitiesToSelectedDenotationSpanCommand(
      this.#annotationModel,
      this.#selectionModel,
      entities
    )
  }

  pasteTypesToSelectedSpansCommand(
    typeValuesList,
    newTypes = [],
    attrDefs = [],
    newSelectionAttributeObjects = []
  ) {
    return new PasteTypesToSelectedDenotationSpansCommand(
      this.#annotationModel,
      this.#selectionModel,
      typeValuesList,
      newTypes,
      attrDefs,
      newSelectionAttributeObjects
    )
  }

  replicateSpanCommand(span, typeValuesList, isDelimiterFunc) {
    return new ReplicateSpanCommand(
      this.#editorID,
      this.#annotationModel,
      this.#selectionModel,
      span,
      typeValuesList,
      isDelimiterFunc
    )
  }

  removeAttributesFromItemsByPredCommand(items, attributeDefinition) {
    return new RemoveAttributesFromItemsByPredCommand(
      this.#annotationModel,
      items,
      attributeDefinition
    )
  }

  removeSpanCommand(id) {
    return new RemoveSpanCommand(this.#annotationModel, id)
  }

  removeSelectedCommand() {
    return new RemoveSelectedCommand(
      this.#annotationModel,
      this.#selectionModel
    )
  }

  removeTypeDefinitionCommand(definitionContainer, removeType) {
    return new RemoveTypeDefinitionCommand(definitionContainer, removeType)
  }

  removeValueFromAttributeDefinitionCommand(attributeDefinition, index) {
    return new RemoveValueFromAttributeDefinitionCommand(
      this.#annotationModel.typeDictionary.attribute,
      attributeDefinition,
      index
    )
  }

  toggleFlagAttributeToItemsCommand(items, attributeDefinition) {
    return new ToggleFlagAttributeToItemsCommand(
      this.#annotationModel,
      items,
      attributeDefinition
    )
  }

  changeTextAndMoveSpanCommand(begin, end, newText) {
    return new ChangeTextAndMoveSpanCommand(
      this.#annotationModel,
      begin,
      end,
      newText
    )
  }
}
