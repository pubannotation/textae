export default class API {
  /**
   * Convert the editor object to an object that can be used from the outside.
   * @param {import('../Editor').default} editor
   */
  constructor(editor) {
    this._editor = editor
  }

  set annotation(annotation) {
    this._editor.load(annotation)
  }

  set inspectCallback(callback) {
    this._editor.setInspector(callback)
  }

  set lastSelectedDenotationIDCallback(callback) {
    this._editor.setLastSelectedDenotationIDCallback(callback)
  }

  get id() {
    return this._editor.HTMLElementID
  }

  focusDenotation(denotationID) {
    this._editor.focusDenotation(denotationID)
  }

  selectDenotation(denotationID) {
    this._editor.selectDenotation(denotationID)
  }
}
