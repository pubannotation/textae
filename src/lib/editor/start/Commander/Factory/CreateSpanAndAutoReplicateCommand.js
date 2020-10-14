import CompositeCommand from './CompositeCommand'
import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import TypeValues from '../../../TypeValues'

const BLOCK_THRESHOLD = 100

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    newSpan,
    defaultType,
    isReplicateAuto,
    detectBoundaryFunc
  ) {
    super()

    const typeValuesList = [new TypeValues(defaultType)]

    this._subCommands = [
      new CreateSpanAndTypesCommand(
        editor,
        annotationData,
        selectionModel,
        newSpan.begin,
        newSpan.end,
        typeValuesList
      )
    ]
    this._logMessage = `create a span ${newSpan.begin}:${newSpan.end} with type ${typeValuesList[0].name}`

    if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
      this._subCommands.push(
        new ReplicateSpanCommand(
          editor,
          annotationData,
          selectionModel,
          {
            begin: newSpan.begin,
            end: newSpan.end
          },
          typeValuesList,
          detectBoundaryFunc
        )
      )
      this._logMessage = `${this._logMessage} and replicate auto`
    }
  }
}
