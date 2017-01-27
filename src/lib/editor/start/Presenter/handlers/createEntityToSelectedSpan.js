module.exports = function(command, spans, entity) {
  var commands = spans.map(function(spanId) {
    return command.factory.entityCreateCommand({
      span: spanId,
      type: entity.getDefaultType()
    })
  })

  command.invoke(commands)
}
