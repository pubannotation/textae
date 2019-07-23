import create from './create'
import update from './update'

export default class {
  constructor(editor, done) {
    this.$dialog = create(editor, done)
  }

  update(predicate, value) {
    update(this.$dialog, predicate, value)
  }

  open() {
    this.$dialog.open()
    this.$dialog.find('input').eq(1).focus().select()
  }
}
