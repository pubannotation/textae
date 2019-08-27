import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeDefinition) {
    super()

    this._subCommands = selectionModel.span.all().map(
      (span) =>
        new CreateCommand(
          editor,
          annotationData,
          selectionModel,
          'entity',
          true,
          {
            span,
            type: typeDefinition.entity.getDefaultType()
          }
        )
    )

    this._logMessage = `create a ${typeDefinition.entity.getDefaultType()} type entity to ${selectionModel.span.all()}`
  }
}
