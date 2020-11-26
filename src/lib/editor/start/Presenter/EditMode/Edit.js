import initPallet from './initPallet'

export default class Edit {
  constructor(
    editor,
    bindMouseEvents,
    mouseEventHandler,
    handler,
    pallet,
    commander,
    editModeName,
    getAutocompletionWs,
    typeContainer
  ) {
    this._editor = editor
    this._bindMouseEvents = bindMouseEvents
    this._mouseEventHandler = mouseEventHandler
    this._handler = handler
    this._pallet = pallet

    initPallet(
      pallet,
      editor,
      commander,
      editModeName,
      handler,
      getAutocompletionWs,
      typeContainer
    )
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
