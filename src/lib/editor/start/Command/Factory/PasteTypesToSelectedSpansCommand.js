import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, types) {
    super()

    this._subCommands = selectionModel.span
      .all()
      .map((span) =>
        types.map(
          (type) =>
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
      )
      .flat()

    this._logMessage = `paste types ${types} to ${selectionModel.span.all()}`
  }
}
