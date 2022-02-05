import { CreateCommand } from '../commandTemplate'
import CompositeCommand from '../CompositeCommand'
import CreateAttributeToTheLatestEntityCommand from './CreateAttributeToTheLatestEntityCommand'

export default class CreateEntityAndAttributesCommand extends CompositeCommand {
  constructor(annotationData, selectionModel, span, typeName, attributes) {
    super()

    this._subCommands = [
      new CreateCommand(
        annotationData,
        'entity',
        {
          span,
          typeName
        },
        selectionModel
      )
    ].concat(
      attributes.map(
        ({ obj, pred }) =>
          // Only one entity was created.
          new CreateAttributeToTheLatestEntityCommand(annotationData, obj, pred)
      )
    )

    this._logMessage = `create a type for span: ${span}`
  }
}
