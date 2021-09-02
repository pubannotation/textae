export default class CursorChanger {
  constructor(editor) {
    this._editor = editor
  }

  startWait() {
    this._editor[0].classList.add('textae-editor--wait')
  }

  endWait() {
    this._editor[0].classList.remove('textae-editor--wait')
  }
}
