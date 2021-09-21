import { CreateCommand } from '../commandTemplate'
import CompositeCommand from '../CompositeCommand'
import CreateAttributeToTheLatestEntityCommand from './CreateAttributeToTheLatestEntityCommand'

export default class CreateEntityAndAttributesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    span,
    typeName,
    attributes
  ) {
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
          new CreateAttributeToTheLatestEntityCommand(
            editor,
            annotationData,
            obj,
            pred
          )
      )
    )

    this._logMessage = `create a type for span: ${span}`
  }
}
