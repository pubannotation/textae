export default function (commands) {
  commands
    .map((c) => c.revert())
    .reverse()
    .map((c) => c.execute())
}
