import { CreateCommand } from './commandTemplate'
import idFactory from '../../../idFactory'
import CompositeCommand from './CompositeCommand'
import CreateEntityCommand from './CreateEntityCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newSpan, types) {
    super()
    const spanId = idFactory.makeSpanId(editor, newSpan)

    this._subCommands = [
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'span',
        true,
        newSpan
      )
    ].concat(
      types.map(
        (type) =>
          new CreateEntityCommand(
            editor,
            annotationData,
            selectionModel,
            spanId,
            type
          )
      )
    )
    this._logMessage = `create a span ${spanId}`
  }
}
