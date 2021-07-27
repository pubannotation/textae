import forwardMethods from '../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class Edit {
  constructor(
    editor,
    bindMouseEvents,
    mouseEventHandler,
    handler,
    pallet,
    commander,
    getAutocompletionWs,
    definitionContainer
  ) {
    this._editor = editor
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

    editor[0].appendChild(pallet.el)

    forwardMethods(this, () => handler, [
      'editTypeValues',
      'manipulateAttribute',
      'relationClicked'
    ])
    forwardMethods(this, () => pallet, [
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab'
    ])
  }

  init() {
    return this._bindMouseEvents(this._editor, this._mouseEventHandler)
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
