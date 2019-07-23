import create from './create'
import update from './update'

export default class {
  constructor(editor, predicate, value, done) {
    this.$dialog = create(editor, done)
    update(this.$dialog, predicate, value)
  }

  open() {
    this.$dialog.open()
    this.$dialog.find('input').eq(1).focus().select()
  }
}
