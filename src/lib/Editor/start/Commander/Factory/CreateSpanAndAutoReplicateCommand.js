import CompositeCommand from './CompositeCommand'
import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import TypeValues from '../../../../TypeValues'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'

const BLOCK_THRESHOLD = 100

export default class CreateSpanAndAutoReplicateCommand extends CompositeCommand {
  constructor(
    editorID,
    annotationData,
    selectionModel,
    newSpan,
    defaultType,
    isReplicateAuto,
    isDelimiterFunc
  ) {
    super()

    const typeValuesList = [new TypeValues(defaultType)]

    const spanID = makeDenotationSpanHTMLElementID(
      editorID,
      newSpan.begin,
      newSpan.end
    )

    this._subCommands = [
      new CreateSpanAndTypesCommand(
        annotationData,
        selectionModel,
        spanID,
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
          annotationData,
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
