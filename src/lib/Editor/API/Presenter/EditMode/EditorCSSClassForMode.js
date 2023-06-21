export default class EditorCSSClassForMode {
  constructor(editorHTMLElement) {
    this._editorHTMLElement = editorHTMLElement
  }

  setViewWithRelation() {
    this.setCssClassFor('view-with-relation')
  }

  setViewWithoutRelation() {
    this.setCssClassFor('view-without-relation')
  }

  setDenotationWithRelation() {
    this.setCssClassFor('denotation-with-relation')
  }

  setDenotationWithoutRelation() {
    this.setCssClassFor('denotation-without-relation')
  }

  setBlockWithRelation() {
    this.setCssClassFor('block-with-relation')
  }

  setBlockWithoutRelation() {
    this.setCssClassFor('block-without-relation')
  }

  setRelation() {
    this.setCssClassFor('relation')
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
