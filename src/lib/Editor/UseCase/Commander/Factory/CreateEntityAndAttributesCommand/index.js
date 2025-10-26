import CompositeCommand from '../CompositeCommand'
import { CreateCommand } from '../commandTemplate'
import CreateAttributeToTheLatestEntityCommand from './CreateAttributeToTheLatestEntityCommand'

export default class CreateEntityAndAttributesCommand extends CompositeCommand {
  constructor(
    annotationModel,
    selectionModel,
    spanType,
    begin,
    end,
    typeName,
    attributes
  ) {
    super()

    this._subCommands = [
      new CreateCommand(
        annotationModel,
        'entity',
        { spanType, begin, end, typeName },
        selectionModel
      )
    ].concat(
      attributes.map(
        ({ obj, pred }) =>
          // Only one entity was created.
          new CreateAttributeToTheLatestEntityCommand(
            annotationModel,
            obj,
            pred
          )
      )
    )

    this._logMessage = `span: ${begin}:${end}, type: ${typeName}${
      attributes.length
        ? `, attributes: ${attributes.map(({ pred }) => pred).join(', ')}`
        : ''
    }`
  }
}
