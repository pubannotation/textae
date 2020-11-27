import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class CreateDefaultTypeEntityToSelectedSpans extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeName) {
    super()

    const selectedSpans = selectionModel.span.all.map((span) => span.id)
    this._subCommands = selectedSpans.map(
      (span) =>
        new CreateCommand(
          editor,
          annotationData,
          selectionModel,
          'entity',
          true,
          {
            span,
            typeName
          }
        )
    )

    this._logMessage = `create a ${typeName} type entity to ${selectedSpans}`
  }
}
