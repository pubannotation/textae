import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'

export default class CreateSpanAndTypesCommand extends CompositeCommand {
  constructor(
    annotationData,
    selectionModel,
    spanId,
    begin,
    end,
    typeValuesList
  ) {
    super()

    this._subCommands = [
      new CreateCommand(
        annotationData,
        'span',
        {
          begin,
          end
        },
        selectionModel
      )
    ].concat(
      typeValuesList.map(
        (typeValues) =>
          new CreateEntityAndAttributesCommand(
            annotationData,
            selectionModel,
            spanId,
            typeValues.typeName,
            typeValues.attributes
          )
      )
    )
    this._logMessage = `create a span ${spanId}`
  }
}
