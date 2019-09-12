import CompositeCommand from './CompositeCommand'
import SpanAndTypesCreateCommand from './SpanAndTypesCreateCommand'
import SpanReplicateCommand from './SpanReplicateCommand'
import TypeModel from '../../../Model/AnnotationData/Container/SpanContainer/TypeModel'

const BLOCK_THRESHOLD = 100

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    newSpan,
    types,
    isReplicateAuto,
    detectBoundaryFunc
  ) {
    super()

    this._subCommands = [
      new SpanAndTypesCreateCommand(
        editor,
        annotationData,
        selectionModel,
        {
          begin: newSpan.begin,
          end: newSpan.end
        },
        types
      )
    ]
    this._logMessage = `create a span ${newSpan.begin}:${newSpan.end} with type ${types[0].name}`

    if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
      this._subCommands.push(
        new SpanReplicateCommand(
          editor,
          annotationData,
          selectionModel,
          {
            begin: newSpan.begin,
            end: newSpan.end
          },
          types,
          detectBoundaryFunc
        )
      )
      this._logMessage = `${this._logMessage} and replicate auto`
    }
  }
}
