import setEditableStyle from './setEditableStyle'
import changeCssClass from './changeCssClass'

export default class ViewMode {
  constructor(editor) {
    this._editor = editor
  }

  setViewWithRelation() {
    changeCssClass(this._editor, 'instance')
    setEditableStyle(this._editor, false)
  }

  setViewWithoutRelation() {
    changeCssClass(this._editor, 'term')
    setEditableStyle(this._editor, false)
  }

  setDenotationWithRelation() {
    changeCssClass(this._editor, 'instance')
    setEditableStyle(this._editor, true)
  }

  setDenotationWithoutRelation() {
    changeCssClass(this._editor, 'term')
    setEditableStyle(this._editor, true)
  }

  setBlockWithRelation() {
    changeCssClass(this._editor, 'block')
    setEditableStyle(this._editor, true)
  }

  setBlockWithoutRelation() {
    changeCssClass(this._editor, 'block')
    setEditableStyle(this._editor, true)
  }

  setRelation() {
    changeCssClass(this._editor, 'relation')
    setEditableStyle(this._editor, true)
  }
}
