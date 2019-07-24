import invokeCommand from '../invokeCommand'
import commandLog from './commandLog'
import _ from 'underscore'

var setRevertAndLog = (function() {
  var log = function(prefix, param) {
    commandLog(
      prefix + param.commandType + ' a ' + param.modelType + ': ' + param.id
    )
  }
  var doneLog = _.partial(log, '')
  var revertLog = _.partial(log, 'revert ')
  var RevertFunction = function(subCommands, logParam) {
    var toRevert = function(command) {
      return command.revert()
    }
    var execute = function(command) {
      command.execute()
    }
    var revertedCommand = {
      execute: function() {
        invokeCommand.invokeRevert(subCommands)
        revertLog(logParam)
      }
    }

    return function() {
      return revertedCommand
    }
  }
  var setRevert = function(modelType, command, commandType, id, subCommands) {
    var logParam = {
      modelType: modelType,
      commandType: commandType,
      id: id
    }

    command.revert = new RevertFunction(subCommands, logParam)
    return logParam
  }

  return _.compose(
    doneLog,
    setRevert
  )
})()
var executeCompositCommand = function(
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
