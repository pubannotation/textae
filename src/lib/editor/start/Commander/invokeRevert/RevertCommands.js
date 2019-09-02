export default function(commands) {
  commands = Object.create(commands)
  commands.reverse()
  return commands.map((originCommand) => {
    return originCommand.revert()
  })
}
