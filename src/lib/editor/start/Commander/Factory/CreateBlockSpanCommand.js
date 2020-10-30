import { makeBlockSpanDomId } from '../../../idFactory'
import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityCommand from './CreateEntityCommand'

export default class CreateBlockCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, begin, end, defaultType) {
    super()

    const spanId = makeBlockSpanDomId(editor, begin, end)
    const createSpanCommand = new CreateCommand(
      editor,
      annotationData,
      selectionModel,
      'span',
      true,
      {
        begin,
        end,
        isBlock: true
      }
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
