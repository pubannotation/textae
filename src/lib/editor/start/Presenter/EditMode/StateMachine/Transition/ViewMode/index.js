import changeCssClass from './changeCssClass'

export default class {
  constructor(editor) {
    this._editor = editor
  }

  setTerm() {
    changeCssClass(this._editor, 'term')
  }

  setBlock() {
    changeCssClass(this._editor, 'block')
  }

  setInstance() {
    changeCssClass(this._editor, 'instance')
  }

  setRelation() {
    changeCssClass(this._editor, 'relation')
  }
}
