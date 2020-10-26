import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class MoveSpanCommand extends AnnotationCommand {
  constructor(annotationData, spanId, begin, end) {
    super()
    this._annotationData = annotationData
    this._spanId = spanId
    this._begin = begin
    this._end = end
  }

  execute() {
    // Update model
    const { id, begin, end } = this._annotationData.span.moveObjectSpan(
      this._spanId,
      this._begin,
      this._end
    )

    this._newId = id
    this._oldBegin = begin
    this._oldEnd = end

    commandLog(
      `move span: ${this._spanId} to {begin: ${this._begin}, end: ${this._end}}`
    )
  }

  revert() {
    return new MoveSpanCommand(
      this._annotationData,
      this._newId,
      this._oldBegin,
      this._oldEnd
    )
  }
}
