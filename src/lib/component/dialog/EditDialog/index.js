import create from './create'

export default class {
  constructor(editor, predicate, value, done) {
    this.$dialog = create(editor, predicate, value, done)
  }

  open() {
    this.$dialog.open()

    // I do not know the reason, but the input element can not be focused without inserting a timeout.
    setTimeout(() => this.$dialog.find('input').eq(1).focus(), 0)
  }
}
