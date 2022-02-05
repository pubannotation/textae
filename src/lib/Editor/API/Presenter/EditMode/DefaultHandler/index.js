import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import AttributeEditor from './AttributeEditor'

export default class DefaultHandler {
  constructor(
    editorHTMLElement,
    annotationType,
    definitionContainer,
    commander,
    annotationData,
    selectionModelItems,
    typeValuesPallet
  ) {
    this._annotationType = annotationType
    this._definitionContainer = definitionContainer
    this._commander = commander
    this._attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModelItems,
      new SelectionAttributePallet(editorHTMLElement),
      () => this.editTypeValues(),
      typeValuesPallet
    )
  }

  selectAll(typeName) {
    this._selectionModel.removeAll()
    for (const { id } of this._annotationData[this._annotationType].findByType(
      typeName
    )) {
      this._selectionModel[this._annotationType].add(id)
    }
  }

  changeTypeOfSelectedElement(newType) {
    return this._commander.factory.changeTypeOfSelectedItemsCommand(
      this._annotationType,
      newType
    )
  }

  addTypeDefinition(newType) {
    console.assert(newType.id, 'id is necessary!')
    return this._commander.factory.createTypeDefinitionCommand(
      this._definitionContainer,
      newType
    )
  }

  changeTypeDefinition(id, changedProperties) {
    return this._commander.factory.changeTypeDefinitionCommand(
      this._definitionContainer,
      this._annotationType,
      id,
      changedProperties
    )
  }

  removeTypeDefinition(id, label) {
    const removeType = {
      id,
      label: label || ''
    }

    if (typeof id === 'undefined') {
      throw new Error('You must set the type id to remove.')
    }

    return this._commander.factory.removeTypeDefinitionCommand(
      this._definitionContainer,
      removeType
    )
  }

  relationClicked() {}

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this._attributeEditor.deleteAt(number)
    } else {
      this._attributeEditor.addOrEditAt(number)
    }
  }

  _typeValuesChanged({ typeName, label, attributes = [] }) {
    const commands = this._commander.factory.changeTypeValuesCommand(
      label,
      typeName,
      this._definitionContainer,
      attributes
    )

    if (typeName) {
      this._commander.invoke(commands)
    }
  }
}