import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class MoveDenotationSpanCommand extends AnnotationCommand {
  constructor(annotationModel, spanId, begin, end) {
    super()
    this._annotationModel = annotationModel
    this._spanId = spanId
    this._begin = begin
    this._end = end
  }

  execute() {
    // Update instance.
    const { id, begin, end } = this._annotationModel.span.moveDenotationSpan(
      this._spanId,
      this._begin,
      this._end
    )

    this._newId = id
    this._oldBegin = begin
    this._oldEnd = end

    commandLog(
      this,
      `move span: ${this._spanId} to {begin: ${this._begin}, end: ${this._end}}`
    )
  }

  revert() {
    return new MoveDenotationSpanCommand(
      this._annotationModel,
      this._newId,
      this._oldBegin,
      this._oldEnd
    )
  }
}
