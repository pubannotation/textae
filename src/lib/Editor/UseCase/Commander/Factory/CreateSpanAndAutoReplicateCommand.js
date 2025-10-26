import TypeValues from '../../../../TypeValues'
import CompositeCommand from './CompositeCommand'
import CreateDenotationSpanAndTypesCommand from './CreateDenotationSpanAndTypesCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'

const BLOCK_THRESHOLD = 100

export default class CreateSpanAndAutoReplicateCommand extends CompositeCommand {
  constructor(
    editorID,
    annotationModel,
    selectionModel,
    newSpan,
    defaultType,
    isReplicateAuto,
    isDelimiterFunc
  ) {
    super()

    const typeValuesList = [new TypeValues(defaultType)]

    this._subCommands = [
      new CreateDenotationSpanAndTypesCommand(
        annotationModel,
        selectionModel,
        editorID,
        newSpan.begin,
        newSpan.end,
        typeValuesList
      )
    ]
    this._logMessage = `create a span ${newSpan.begin}:${newSpan.end} with type ${typeValuesList[0].typeName}`

    if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
      this._subCommands.push(
        new ReplicateSpanCommand(
          editorID,
          annotationModel,
          selectionModel,
          {
            begin: newSpan.begin,
            end: newSpan.end
          },
          typeValuesList,
          isDelimiterFunc
        )
      )
      this._logMessage = `${this._logMessage} and replicate auto`
    }
  }
}
