import idFactory from '../../../../../idFactory'

export default function(editor, command, spanId, newSpan) {
  // Do not need move.
  if (spanId === idFactory.makeSpanId(editor, newSpan)) {
    return undefined
  }

  return [command.factory.spanMoveCommand(spanId, newSpan)]
}
