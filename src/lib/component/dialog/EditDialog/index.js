import create from './create'

export default class {
  constructor(predicate, value, done) {
    this.$dialog = create(predicate, value, done)
  }

  open() {
    this.$dialog.open()
  }
}
