export default class ViewMode {
  constructor(editor) {
    this._editor = editor
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
    for (const cssClass of this._editor.classList) {
      if (cssClass.startsWith('textae-editor__mode')) {
        this._editor.classList.remove(cssClass)
      }
    }

    this._editor.classList.add(`textae-editor__mode--${mode}`)
  }
}
