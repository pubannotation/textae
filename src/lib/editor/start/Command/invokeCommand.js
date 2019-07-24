import _ from 'underscore'

const invoke = function(commands) {
  commands.forEach((command) => {
    command.execute()
  })
}
const RevertCommands = function(commands) {
  commands = Object.create(commands)
  commands.reverse()
  return commands.map((originCommand) => {
    return originCommand.revert()
  })
}
const invokeRevert = _.compose(
  invoke,
  RevertCommands
)
const invokeCommand = {
  invoke,
  invokeRevert
}

module.exports = invokeCommand
