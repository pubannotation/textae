export default function(commands) {
  commands.forEach((command) => {
    command.execute()
  })
}
