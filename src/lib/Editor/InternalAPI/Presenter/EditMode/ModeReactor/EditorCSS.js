export default class EditorCSS {
  constructor(editorHTMLElement) {
    this._editorHTMLElement = editorHTMLElement
  }

  clear() {
    for (const cssClass of this._editorHTMLElement.classList) {
      if (cssClass.startsWith('textae-editor__mode')) {
        this._editorHTMLElement.classList.remove(cssClass)
      }
    }
  }

  setFor(mode) {
    this._editorHTMLElement.classList.add(`textae-editor__mode--${mode}`)
  }
}
