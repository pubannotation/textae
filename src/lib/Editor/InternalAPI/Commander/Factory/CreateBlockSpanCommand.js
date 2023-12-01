import { makeBlockSpanHTMLElementID } from '../../../idFactory'
import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'

export default class CreateBlockCommand extends CompositeCommand {
  constructor(
    editorID,
    annotationData,
    selectionModel,
    begin,
    end,
    defaultType
  ) {
    super()

    const spanId = makeBlockSpanHTMLElementID(editorID, begin, end)
    const createSpanCommand = new CreateCommand(
      annotationData,
      'span',
      {
        begin,
        end,
        isBlock: true
      },
      selectionModel
    )
    const createEntityCommand = new CreateEntityAndAttributesCommand(
      annotationData,
      selectionModel,
      spanId,
      defaultType,
      []
    )

    this._subCommands = [createSpanCommand, createEntityCommand]
    this._logMessage = `create a span ${spanId}`
  }
}
