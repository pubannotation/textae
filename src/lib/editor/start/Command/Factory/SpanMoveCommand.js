import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

export default class SpanMoveCommand extends BaseCommand {
  constructor(editor, annotationData, spanId, newSpan) {
    super(function() {
      // Update model
      const [oldSpan, newId] = annotationData.span.move(spanId, newSpan)

      // Set revert
      this.revert = () =>
        new SpanMoveCommand(editor, annotationData, newId, oldSpan)

      commandLog(
        `move span: ${spanId} to {begin: ${newSpan.begin}, end: ${newSpan.end}}`
      )
    })
  }
}
