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
    typeContainer
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
      typeContainer
    )

    editor.eventEmitter
      .on('textae.editor.unselect', () => pallet.hide()) // Close pallet when selecting other editor.
      .on('textae.history.change', () => pallet.updateDisplay()) // Update save config button when changing history and savigng configuration.
      .on('textae.configuration.save', () => pallet.updateDisplay())
      .on(`textae.typeDefinition.type.lock`, () => pallet.updateDisplay())

    editor[0].appendChild(pallet.el)
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
}
