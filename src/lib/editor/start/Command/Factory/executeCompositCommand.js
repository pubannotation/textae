import invokeCommand from '../invokeCommand'
import commandLog from './commandLog'
import _ from 'underscore'

var setRevertAndLog = (function() {
    var log = function(prefix, param) {
        commandLog(
          prefix + param.commandType + ' a ' + param.modelType + ': ' + param.id
        )
      },
      doneLog = _.partial(log, ''),
      revertLog = _.partial(log, 'revert '),
      RevertFunction = function(subCommands, logParam) {
        var toRevert = function(command) {
            return command.revert()
          },
          execute = function(command) {
            command.execute()
          },
          revertedCommand = {
            execute: function() {
              invokeCommand.invokeRevert(subCommands)
              revertLog(logParam)
            }
          }

        return function() {
          return revertedCommand
        }
      },
      setRevert = function(modelType, command, commandType, id, subCommands) {
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
  })(),
  executeCompositCommand = function(
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
