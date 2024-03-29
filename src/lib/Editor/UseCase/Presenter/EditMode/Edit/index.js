import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class Edit {
  constructor(
    editorHTMLElement,
    selectionModel,
    annotationModel,
    pallet,
    commander,
    getAutocompletionWs,
    definitionContainer,
    annotationType
  ) {
    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
    this._annotationModel = annotationModel
    this._getAutocompletionWs = getAutocompletionWs
    this._definitionContainer = definitionContainer
    this._commander = commander

    this._pallet = pallet

    bindPalletEvents(
      pallet,
      commander,
      getAutocompletionWs,
      definitionContainer,
      annotationType,
      selectionModel,
      annotationModel
    )

    editorHTMLElement.appendChild(pallet.el)

    forwardMethods(this, () => pallet, [
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab'
    ])
  }

  get pallet() {
    return this._pallet
  }

  // Dummy functions
  createSpan() {}
  expandSpan() {}
  shrinkSpan() {}
  relationClicked() {}
  relationBollardClicked() {}

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
