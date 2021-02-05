export default function (commands) {
  return commands.map((originCommand) => originCommand.revert()).reverse()
}
