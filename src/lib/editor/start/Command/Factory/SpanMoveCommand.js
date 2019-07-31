import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

export default class SpanMoveCommand extends BaseCommand {
  constructor(editor, annotationData, spanId, newSpan) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.spanId = spanId
    this.newSpan = newSpan
  }

  execute() {
    // Update model
    const [oldSpan, newId] = this.annotationData.span.move(
      this.spanId,
      this.newSpan
    )

    this.oldSpan = oldSpan
    this.newId = newId

    commandLog(
      `move span: ${this.spanId} to {begin: ${this.newSpan.begin}, end: ${this.newSpan.end}}`
    )
  }

  revert() {
    return new SpanMoveCommand(
      this.editor,
      this.annotationData,
      this.newId,
      this.oldSpan
    )
  }
}
