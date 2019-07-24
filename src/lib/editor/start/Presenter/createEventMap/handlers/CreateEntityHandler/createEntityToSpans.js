export default function(command, spans, type) {
  const commands = spans.map((span) =>
    command.factory.entityCreateCommand({
      span,
      type
    })
  )

  command.invoke(commands, ['annotation'])
}
