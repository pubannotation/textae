import _ from 'underscore'

const invoke = function(commands) {
  commands.forEach(function(command) {
    command.execute()
  })
}
const RevertCommands = function(commands) {
  commands = Object.create(commands)
  commands.reverse()
  return commands.map(function(originCommand) {
    return originCommand.revert()
  })
}
const invokeRevert = _.compose(
  invoke,
  RevertCommands
)
const invokeCommand = {
  invoke: invoke,
  invokeRevert: invokeRevert
}

module.exports = invokeCommand
