import { makeBlockSpanHTMLElementID } from '../../../idFactory'
import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'

export default class CreateBlockCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, begin, end, defaultType) {
    super()

    const spanId = makeBlockSpanHTMLElementID(editor, begin, end)
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
      editor,
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
