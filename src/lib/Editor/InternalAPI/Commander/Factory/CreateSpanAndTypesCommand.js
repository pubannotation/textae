import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'

export default class CreateSpanAndTypesCommand extends CompositeCommand {
  constructor(
    annotationModel,
    selectionModel,
    spanId,
    begin,
    end,
    typeValuesList
  ) {
    super()

    this._subCommands = [
      new CreateCommand(
        annotationModel,
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
            annotationModel,
            selectionModel,
            spanId,
            typeValues.typeName,
            typeValues.attributes
          )
      )
    )
    this._logMessage = `span: ${spanId}, types: ${typeValuesList
      .map(({ typeName }) => typeName)
      .join(', ')}`
  }
}
