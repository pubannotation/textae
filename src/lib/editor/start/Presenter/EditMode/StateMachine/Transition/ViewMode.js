export default class ViewMode {
  constructor(editor) {
    this._editor = editor
  }

  setViewWithRelation() {
    this._changeCssClass('view-with-relation')
  }

  setViewWithoutRelation() {
    this._changeCssClass('view-without-relation')
  }

  setDenotationWithRelation() {
    this._changeCssClass('denotation-with-relation')
  }

  setDenotationWithoutRelation() {
    this._changeCssClass('denotation-without-relation')
  }

  setBlockWithRelation() {
    this._changeCssClass('block-with-relation')
  }

  setBlockWithoutRelation() {
    this._changeCssClass('block-without-relation')
  }

  setRelation() {
    this._changeCssClass('relation')
  }

  _changeCssClass(mode) {
    for (const cssClass of this._editor.classList) {
      if (cssClass.startsWith('textae-editor__mode')) {
        this._editor.classList.remove(cssClass)
      }
    }

    this._editor.classList.add(`textae-editor__mode--${mode}`)
  }
}
