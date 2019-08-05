export default class {
  constructor(commands, kinds) {
    console.assert(
      kinds,
      'Please set the second argument ―― it describes what kind of type the invoking command.'
    )

    this._kinds = kinds
    this.commands = commands
  }

  get kinds() {
    return new Set(this._kinds)
  }

  get hasCommands() {
    return this.commands && this.commands.length > 0
  }

  isExactly(kind) {
    const kinds = this.kinds
    return kinds.has(kind) && kinds.size === 1
  }
}
