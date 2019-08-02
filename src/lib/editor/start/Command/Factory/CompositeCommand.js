import invokeCommand from '../invokeCommand'
import commandLog from './commandLog'

export default class {
  execute(modelType, commandType, id, subCommands) {
    invokeCommand.invoke(subCommands)
    this.revert = () => ({
      execute() {
        invokeCommand.invokeRevert(subCommands)
        commandLog(`revert ${commandType} a ${modelType}: ${id}`)
      }
    })
    commandLog(`${commandType} a ${modelType}: ${id}`)
  }
}
