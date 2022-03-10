import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class Edit {
  constructor(
    editorHTMLElement,
    bindMouseEvents,
    mouseEventHandler,
    handler,
    pallet,
    commander,
    getAutocompletionWs,
    definitionContainer
  ) {
    this._editorHTMLElement = editorHTMLElement
    this._bindMouseEvents = bindMouseEvents
    this._mouseEventHandler = mouseEventHandler
    this._handler = handler
    this._pallet = pallet

    bindPalletEvents(
      pallet,
      commander,
      handler,
      getAutocompletionWs,
      definitionContainer
    )

    editorHTMLElement.appendChild(pallet.el)

    forwardMethods(this, () => handler, ['editTypeValues', 'relationClicked'])
    forwardMethods(this, () => pallet, [
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab'
    ])
  }

  init() {
    return this._bindMouseEvents(
      this._editorHTMLElement,
      this._mouseEventHandler
    )
  }

  get handler() {
    return this._handler
  }

  get pallet() {
    return this._pallet
  }

  // Dummy funcitions
  createSpan() {}
  expandSpan() {}
  shrinkSpan() {}
}
