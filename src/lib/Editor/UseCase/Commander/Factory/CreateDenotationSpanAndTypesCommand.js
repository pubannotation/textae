import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'
import { CreateCommand } from './commandTemplate'

export default class CreateDenotationSpanAndTypesCommand extends CompositeCommand {
  constructor(
    annotationModel,
    selectionModel,
    _editorID,
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
            'denotation',
            begin,
            end,
            typeValues.typeName,
            typeValues.attributes
          )
      )
    )
    this._logMessage = `span: ${begin}:${end}, types: ${typeValuesList
      .map(({ typeName }) => typeName)
      .join(', ')}`
  }
}
