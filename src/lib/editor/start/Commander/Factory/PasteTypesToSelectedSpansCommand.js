import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'

export default class PasteTypesToSelectedSpansCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeValuesList) {
    super()

    const selecteedSpans = selectionModel.span.all.map((span) => span.id)
    this._subCommands = selecteedSpans
      .map((span) =>
        typeValuesList.map(
          (typeValues) =>
            new CreateEntityAndAttributesCommand(
              editor,
              annotationData,
              selectionModel,
              span,
              typeValues.typeName,
              typeValues.attributes
            )
        )
      )
      .flat()

    this._logMessage = `paste types ${typeValuesList} to ${selecteedSpans}`
  }
}
