import create from './create'

export default class {
  constructor(editor, predicate, value, done) {
    this.$dialog = create(editor, predicate, value, done)
  }

  open() {
    this.$dialog.open()
    this.$dialog.find('input').eq(1).focus().select()
  }
}
