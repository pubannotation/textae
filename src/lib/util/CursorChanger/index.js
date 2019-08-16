import changeCursor from './changeCursor'

export default class {
  constructor(editor) {
    this._editor = editor
  }

  startWait() {
    changeCursor(this._editor, 'add')
  }

  endWait() {
    changeCursor(this._editor, 'remove')
  }
}
