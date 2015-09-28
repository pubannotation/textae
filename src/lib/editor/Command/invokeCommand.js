var invoke = function(commands) {
    commands.forEach(function(command) {
      command.execute()
    })
  },
  RevertCommands = function(commands) {
    commands = Object.create(commands)
    commands.reverse()
    return commands.map(function(originCommand) {
      return originCommand.revert()
    })
  },
  invokeRevert = _.compose(invoke, RevertCommands),
  invokeCommand = {
    invoke: invoke,
    invokeRevert: invokeRevert
  }

module.exports = invokeCommand
