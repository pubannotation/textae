import invokeCommand from '../invokeCommand'
import commandLog from './commandLog'
import _ from 'underscore'

const setRevertAndLog = (function() {
  const log = function(prefix, param) {
    commandLog(
      `${prefix + param.commandType} a ${param.modelType}: ${param.id}`
    )
  }
  const doneLog = _.partial(log, '')
  const revertLog = _.partial(log, 'revert ')
  const RevertFunction = function(subCommands, logParam) {
    const toRevert = function(command) {
      return command.revert()
    }
    const execute = function(command) {
      command.execute()
    }
    const revertedCommand = {
      execute() {
        invokeCommand.invokeRevert(subCommands)
        revertLog(logParam)
      }
    }

    return function() {
      return revertedCommand
    }
  }
  const setRevert = function(modelType, command, commandType, id, subCommands) {
    const logParam = {
      modelType,
      commandType,
      id
    }

    command.revert = new RevertFunction(subCommands, logParam)
    return logParam
  }

  return _.compose(
    doneLog,
    setRevert
  )
})()
const executeCompositCommand = function(
  modelType,
  command,
  commandType,
  id,
  subCommands
) {
  invokeCommand.invoke(subCommands)
  setRevertAndLog(modelType, command, commandType, id, subCommands)
}

module.exports = executeCompositCommand
