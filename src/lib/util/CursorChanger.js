export default class CursorChanger {
  constructor(editor) {
    this._editor = editor
  }

  startWait() {
    this._editor.startWait()
  }

  endWait() {
    this._editor.endWait()
  }
}
