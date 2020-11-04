export default function (commands) {
  return commands.map((c) => c.execute())
}
