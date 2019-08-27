import { CreateCommand } from './commandTemplate'
import idFactory from '../../../idFactory'
import CompositeCommand from './CompositeCommand'
import EntitCreateCommand from './EntityCreateCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newSpan, types) {
    super()
    const spanId = idFactory.makeSpanId(editor, newSpan)

    this.subCommands = [
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
          new EntitCreateCommand(
            editor,
            annotationData,
            selectionModel,
            spanId,
            type.name,
            type.attributes
          )
      )
    )
    this._logMessage = `create a span ${spanId}`
  }
}
