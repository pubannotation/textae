import { CreateCommand } from './commandTemplate'
import idFactory from '../../../idFactory'
import CompositeCommand from './CompositeCommand'
import CreateEntityCommand from './CreateEntityCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    begin,
    end,
    typeValuesList
  ) {
    super()
    const spanId = idFactory.makeSpanDomId(editor, begin, end)

    this._subCommands = [
      new CreateCommand(editor, annotationData, selectionModel, 'span', true, {
        begin,
        end
      })
    ].concat(
      typeValuesList.map(
        (typeValues) =>
          new CreateEntityCommand(
            editor,
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
