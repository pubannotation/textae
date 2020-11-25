export default class Edit {
  constructor(editor, bindMouseEvents, mouseEventHandler, handler) {
    this._editor = editor
    this._bindMouseEvents = bindMouseEvents
    this._mouseEventHandler = mouseEventHandler
    this._handler = handler
  }

  init() {
    return this._bindMouseEvents(this._editor, this._mouseEventHandler)
  }

  get handler() {
    return this._handler
  }
}
