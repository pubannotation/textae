import EditPropertiesDialog from '../../../../../component/EditPropertiesDialog'

export default class PropertyEditor {
  #editorHTMLElement
  #commander
  #pallet
  #palletName
  #mousePoint
  #definitionContainer
  #annotationModel
  #annotationType

  constructor(
    editorHTMLElement,
    commander,
    pallet,
    palletName,
    mousePoint,
    definitionContainer,
    annotationModel,
    annotationType
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#commander = commander
    this.#pallet = pallet
    this.#palletName = palletName
    this.#mousePoint = mousePoint
    this.#definitionContainer = definitionContainer
    this.#annotationModel = annotationModel
    this.#annotationType = annotationType
  }

  startEditing(selectionModel) {
    if (selectionModel.some) {
      this.#createEditPropertiesDialog(selectionModel.all)
        .open()
        .then((values) => this.#typeValuesChanged(values))
    }
  }

  #typeValuesChanged({ typeName, label, attributes = [] }) {
    const commands = this.#commander.factory.changeTypeValuesCommand(
      label,
      typeName,
      this.#definitionContainer,
      attributes
    )

    if (typeName) {
      this.#commander.invoke(commands)
    }
  }

  #createEditPropertiesDialog(selectedItems) {
    return new EditPropertiesDialog(
      this.#editorHTMLElement,
      this.#annotationType,
      this.#palletName,
      this.#definitionContainer,
      this.#annotationModel.typeDictionary.attribute,
      selectedItems,
      this.#pallet,
      this.#mousePoint
    )
  }
}
