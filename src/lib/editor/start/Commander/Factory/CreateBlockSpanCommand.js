import { makeBlockSpanHTMLElementId } from '../../../idFactory'
import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityCommand from './CreateEntityCommand'

export default class CreateBlockCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, begin, end, defaultType) {
    super()

    const spanId = makeBlockSpanHTMLElementId(editor, begin, end)
    const createSpanCommand = new CreateCommand(
      editor,
      annotationData,
      'span',
      {
        begin,
        end,
        isBlock: true
      },
      selectionModel,
      true
    )
    const createEntityCommand = new CreateEntityCommand(
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
