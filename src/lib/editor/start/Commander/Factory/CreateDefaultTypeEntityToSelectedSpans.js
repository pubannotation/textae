import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, type) {
    super()

    this._subCommands = selectionModel.span.all.map(
      (span) =>
        new CreateCommand(
          editor,
          annotationData,
          selectionModel,
          'entity',
          true,
          {
            span,
            type
          }
        )
    )

    this._logMessage = `create a ${type} type entity to ${selectionModel.span.all}`
  }
}
