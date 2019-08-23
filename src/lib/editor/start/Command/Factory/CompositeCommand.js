import invoke from '../invoke'
import invokeRevert from '../invokeRevert'
import commandLog from './commandLog'
import BaseCommand from './BaseCommand'

export default class extends BaseCommand {
  execute(modelType, commandType, id, subCommands) {
    invoke(subCommands)
    this.revert = () => ({
      execute() {
        invokeRevert(subCommands)
        commandLog(`revert ${commandType} a ${modelType}: ${id}`)
      }
    })
    commandLog(`${commandType} a ${modelType}: ${id}`)
  }

  get kind() {
    return this.subCommands.reduce(
      (acc, curr) => new Set([...acc, ...curr.kind]),
      new Set()
    )
  }
}
