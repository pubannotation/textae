import invoke from '../invoke'
import invokeRevert from '../invokeRevert'
import commandLog from './commandLog'
import BaseCommand from './BaseCommand'

export default class extends BaseCommand {
  execute() {
    console.assert(this._subCommands, '_subCommands is necessary!')

    invoke(this._subCommands)

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
}
