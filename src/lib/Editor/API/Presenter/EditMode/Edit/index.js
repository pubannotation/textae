import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class Edit {
  constructor(
    editorHTMLElement,
    bindMouseEvents,
    selectionModel,
    annotationData,
    pallet,
    commander,
    getAutocompletionWs,
    definitionContainer,
    annotationType
  ) {
    this._bindMouseEvents = bindMouseEvents
    this._selectionModel = selectionModel
    this._annotationData = annotationData
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
      annotationData
    )

    editorHTMLElement.appendChild(pallet.el)

    forwardMethods(this, () => pallet, [
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab'
    ])
  }

  bindMouseEvents() {
    return this._bindMouseEvents()
  }

  get pallet() {
    return this._pallet
  }

  // Dummy funcitions
  createSpan() {}
  expandSpan() {}
  shrinkSpan() {}
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
