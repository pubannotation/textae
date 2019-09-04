import CompositeCommand from './CompositeCommand'
import EntityCreateCommand from './EntityCreateCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, types) {
    super()

    this._subCommands = selectionModel.span
      .all()
      .map((span) =>
        types.map(
          (type) =>
            new EntityCreateCommand(
              editor,
              annotationData,
              selectionModel,
              span,
              type
            )
        )
      )
      .flat()

    this._logMessage = `paste types ${types} to ${selectionModel.span.all()}`
  }
}
