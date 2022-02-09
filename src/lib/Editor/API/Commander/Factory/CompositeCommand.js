import commandLog from './commandLog'
import BaseCommand from './BaseCommand'

export default class CompositeCommand extends BaseCommand {
  execute() {
    console.assert(this._subCommands, '_subCommands is necessary!')

    // If subCommands is empty, pretend to be executed and don't log.
    if (this.isEmpty) {
      this.revert = () => ({
        execute() {}
      })
      return
    }

    for (const c of this._subCommands) {
      c.execute()
    }

    if (this._afterInvoke) {
      this._afterInvoke()
    }

    const self = this
    this.revert = () => ({
      _subCommands: this._subCommands,
      _logMessage: this._logMessage,
      _afterInvoke: this._afterInvoke,
      execute() {
        for (const c of this._subCommands.map((c) => c.revert()).reverse()) {
          c.execute()
        }

        if (this._afterInvoke) {
          this._afterInvoke()
        }

        commandLog(self, `revert: ${this._logMessage}`)
      }
    })
    commandLog(this, this._logMessage)
  }

  get kind() {
    return this._subCommands.reduce(
      (acc, curr) => new Set([...acc, ...curr.kind]),
      new Set()
    )
  }

  get isEmpty() {
    return !this._subCommands || this._subCommands.length === 0
  }
}
