export default function (commands) {
  commands
    .map((originCommand) => originCommand.revert())
    .reverse()
    .map((c) => c.execute())
}
