import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class CreateDefaultTypeEntityToSelectedSpansCommand extends CompositeCommand {
  constructor(annotationModel, selectionModel, typeName) {
    super()

    const selectedSpans = selectionModel.span.all
      .filter((span) => span.isDenotation)
      .map((span) => span.id)
    this._subCommands = selectedSpans.map(
      (span) =>
        new CreateCommand(
          annotationModel,
          'entity',
          {
            span,
            typeName
          },
          selectionModel
        )
    )

    this._logMessage = `create a ${typeName} type entity to ${selectedSpans}`
  }
}
