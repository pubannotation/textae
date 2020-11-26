export default class Edit {
  constructor(editor, bindMouseEvents, mouseEventHandler, handler, pallet) {
    this._editor = editor
    this._bindMouseEvents = bindMouseEvents
    this._mouseEventHandler = mouseEventHandler
    this._handler = handler
    this._pallet = pallet
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
