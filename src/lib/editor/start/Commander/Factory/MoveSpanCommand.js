import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'
import idFactory from '../../../idFactory'

export default class MoveSpanCommand extends AnnotationCommand {
  constructor(editor, annotationData, spanId, newSpan) {
    console.assert(
      spanId !== idFactory.makeSpanDomId(editor, newSpan.begin, newSpan.end),
      `Do not need move span:  ${spanId} ${newSpan}`
    )

    super()
    this._editor = editor
    this._annotationData = annotationData
    this._spanId = spanId
    this._newSpan = newSpan
  }

  execute() {
    // Update model
    const [oldSpan, newId] = this._annotationData.span.moveObjectSpan(
      this._spanId,
      this._newSpan
    )

    this._oldSpan = oldSpan
    this._newId = newId

    commandLog(
      `move span: ${this._spanId} to {begin: ${this._newSpan.begin}, end: ${this._newSpan.end}}`
    )
  }

  revert() {
    return new MoveSpanCommand(
      this._editor,
      this._annotationData,
      this._newId,
      this._oldSpan
    )
  }
}
