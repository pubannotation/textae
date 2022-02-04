export default class EditorCSSClass {
  constructor(editorHTMLElement) {
    this._editorHTMLElement = editorHTMLElement
  }
  startWait() {
    this._editorHTMLElement.classList.add('textae-editor--wait')
  }
  endWait() {
    this._editorHTMLElement.classList.remove('textae-editor--wait')
  }
}
