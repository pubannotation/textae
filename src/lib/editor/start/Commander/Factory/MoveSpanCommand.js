import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class MoveSpanCommand extends AnnotationCommand {
  constructor(annotationData, spanId, newSpan) {
    super()
    this._annotationData = annotationData
    this._spanId = spanId
    this._newSpan = newSpan
  }

  execute() {
    // Update model
    const { id, begin, end } = this._annotationData.span.moveObjectSpan(
      this._spanId,
      this._newSpan.begin,
      this._newSpan.end
    )

    this._oldSpan = { begin, end }
    this._newId = id

    commandLog(
      `move span: ${this._spanId} to {begin: ${this._newSpan.begin}, end: ${this._newSpan.end}}`
    )
  }

  revert() {
    return new MoveSpanCommand(this._annotationData, this._newId, this._oldSpan)
  }
}
