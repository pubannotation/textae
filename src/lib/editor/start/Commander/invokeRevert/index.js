export default function (commands) {
  for (const c of commands.map((c) => c.revert()).reverse()) {
    c.execute()
  }
}
