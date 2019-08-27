import invoke from '../invoke'
import invokeRevert from '../invokeRevert'
import commandLog from './commandLog'
import BaseCommand from './BaseCommand'

export default class extends BaseCommand {
  execute() {
    invoke(this.subCommands)
    this.revert = () => ({
      subCommands: this.subCommands,
      _logMessage: this._logMessage,
      execute() {
        invokeRevert(this.subCommands)
        commandLog(`revert: ${this._logMessage}`)
      }
    })
    commandLog(this._logMessage)
  }

  get kind() {
    return this.subCommands.reduce(
      (acc, curr) => new Set([...acc, ...curr.kind]),
      new Set()
    )
  }
}
