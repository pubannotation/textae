export default class BaseCommand {
  get isEmpty() {
    return false
  }

  isExactly(kind) {
    return this.kind.has(kind) && this.kind.size === 1
  }
}
