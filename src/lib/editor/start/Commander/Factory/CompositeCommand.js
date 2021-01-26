import invoke from '../invoke'
import invokeRevert from '../invokeRevert'
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

    invoke(this._subCommands)

    if (this._afterInvoke) {
      this._afterInvoke()
    }

    this.revert = () => ({
      _subCommands: this._subCommands,
      _logMessage: this._logMessage,
      execute() {
        invokeRevert(this._subCommands)
        commandLog(`revert: ${this._logMessage}`)
      }
    })
    commandLog(this._logMessage)
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
