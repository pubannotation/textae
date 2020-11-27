import changeCssClass from './changeCssClass'

export default class ViewMode {
  constructor(editor) {
    this._editor = editor
  }

  setViewWithRelation() {
    changeCssClass(this._editor, 'instance')
  }

  setViewWithoutRelation() {
    changeCssClass(this._editor, 'term')
  }

  setDenotationWithRelation() {
    changeCssClass(this._editor, 'instance')
  }

  setDenotationWithoutRelation() {
    changeCssClass(this._editor, 'term')
  }

  setBlockWithRelation() {
    changeCssClass(this._editor, 'block')
  }

  setBlockWithoutRelation() {
    changeCssClass(this._editor, 'block')
  }

  setRelation() {
    changeCssClass(this._editor, 'relation')
  }
}
