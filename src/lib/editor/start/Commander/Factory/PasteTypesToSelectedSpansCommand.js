import CompositeCommand from './CompositeCommand'
import CreateEntityCommand from './CreateEntityCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, types) {
    super()

    const selecteedSpans = selectionModel.span.all.map((span) => span.id)
    this._subCommands = selecteedSpans
      .map((span) =>
        types.map(
          (type) =>
            new CreateEntityCommand(
              editor,
              annotationData,
              selectionModel,
              span,
              type
            )
        )
      )
      .flat()

    this._logMessage = `paste types ${types} to ${selecteedSpans}`
  }
}
