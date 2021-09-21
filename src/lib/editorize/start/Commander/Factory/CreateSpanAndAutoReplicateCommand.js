import CompositeCommand from './CompositeCommand'
import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import ReplicateSpanCommand from './ReplicateSpanCommand'
import TypeValues from '../../../TypeValues'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'

const BLOCK_THRESHOLD = 100

export default class CreateSpanAndAutoReplicateCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    newSpan,
    defaultType,
    isReplicateAuto,
    isDelimiterFunc
  ) {
    super()

    const typeValuesList = [new TypeValues(defaultType)]

    const spanId = makeDenotationSpanHTMLElementID(
      editor.editorId,
      newSpan.begin,
      newSpan.end
    )

    this._subCommands = [
      new CreateSpanAndTypesCommand(
        editor,
        annotationData,
        selectionModel,
        spanId,
        newSpan.begin,
        newSpan.end,
        typeValuesList
      )
    ]
    this._logMessage = `create a span ${newSpan.begin}:${newSpan.end} with type ${typeValuesList[0].typeName}`

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
          isDelimiterFunc
        )
      )
      this._logMessage = `${this._logMessage} and replicate auto`
    }
  }
}
