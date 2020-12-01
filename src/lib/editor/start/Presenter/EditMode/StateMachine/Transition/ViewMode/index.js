import changeCssClass from './changeCssClass'

export default class ViewMode {
  constructor(editor) {
    this._editor = editor
  }

  setViewWithRelation() {
    changeCssClass(this._editor, 'view-with-relation')
  }

  setViewWithoutRelation() {
    changeCssClass(this._editor, 'view-without-relation')
  }

  setDenotationWithRelation() {
    changeCssClass(this._editor, 'denotation-with-relation')
  }

  setDenotationWithoutRelation() {
    changeCssClass(this._editor, 'denotation-without-relation')
  }

  setBlockWithRelation() {
    changeCssClass(this._editor, 'block-with-relation')
  }

  setBlockWithoutRelation() {
    changeCssClass(this._editor, 'block-without-relation')
  }

  setRelation() {
    changeCssClass(this._editor, 'relation')
  }
}
