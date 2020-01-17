import CompositeCommand from './CompositeCommand'
import EntityCreateCommand from './EntityCreateCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, types) {
    super()

    const selecteedSpans = selectionModel.span.all.map((span) => span.id)
    this._subCommands = selecteedSpans
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

    this._logMessage = `paste types ${types} to ${selecteedSpans}`
  }
}
