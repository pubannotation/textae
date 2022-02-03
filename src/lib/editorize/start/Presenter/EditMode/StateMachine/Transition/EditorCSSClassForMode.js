export default class EditorCSSClassForMode {
  constructor(editorHTMLElement) {
    this._editorHTMLElement = editorHTMLElement
  }

  setViewWithRelation() {
    this._setCssClassFor('view-with-relation')
  }

  setViewWithoutRelation() {
    this._setCssClassFor('view-without-relation')
  }

  setDenotationWithRelation() {
    this._setCssClassFor('denotation-with-relation')
  }

  setDenotationWithoutRelation() {
    this._setCssClassFor('denotation-without-relation')
  }

  setBlockWithRelation() {
    this._setCssClassFor('block-with-relation')
  }

  setBlockWithoutRelation() {
    this._setCssClassFor('block-without-relation')
  }

  setRelation() {
    this._setCssClassFor('relation')
  }

  _setCssClassFor(mode) {
    for (const cssClass of this._editorHTMLElement.classList) {
      if (cssClass.startsWith('textae-editor__mode')) {
        this._editorHTMLElement.classList.remove(cssClass)
      }
    }

    this._editorHTMLElement.classList.add(`textae-editor__mode--${mode}`)
  }
}
