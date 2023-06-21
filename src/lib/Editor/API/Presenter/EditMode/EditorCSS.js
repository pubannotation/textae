export default class EditorCSS {
  constructor(editorHTMLElement) {
    this._editorHTMLElement = editorHTMLElement
  }

  setCssClassFor(mode) {
    for (const cssClass of this._editorHTMLElement.classList) {
      if (cssClass.startsWith('textae-editor__mode')) {
        this._editorHTMLElement.classList.remove(cssClass)
      }
    }

    this._editorHTMLElement.classList.add(`textae-editor__mode--${mode}`)
  }
}
