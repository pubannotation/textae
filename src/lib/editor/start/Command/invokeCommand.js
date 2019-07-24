import _ from 'underscore'

var invoke = function(commands) {
  commands.forEach(function(command) {
    command.execute()
  })
}
var RevertCommands = function(commands) {
  commands = Object.create(commands)
  commands.reverse()
  return commands.map(function(originCommand) {
    return originCommand.revert()
  })
}
var invokeRevert = _.compose(
  invoke,
  RevertCommands
)
var invokeCommand = {
  invoke: invoke,
  invokeRevert: invokeRevert
}

module.exports = invokeCommand
