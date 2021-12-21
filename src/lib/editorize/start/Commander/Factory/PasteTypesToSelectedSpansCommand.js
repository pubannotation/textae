import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'

export default class PasteTypesToSelectedSpansCommand extends CompositeCommand {
  constructor(annotationData, selectionModel, typeValuesList, newTypes) {
    super()

    const selecteedSpans = selectionModel.span.all.map((span) => span.id)
    this._subCommands = selecteedSpans
      .map((span) =>
        typeValuesList.map(
          (typeValues) =>
            new CreateEntityAndAttributesCommand(
              annotationData,
              selectionModel,
              span,
              typeValues.typeName,
              typeValues.attributes
            )
        )
      )
      .flat()

    for (const newType of newTypes) {
      this._subCommands.push(
        new CreateTypeDefinitionCommand(
          annotationData.denotationDefinitionContainer,
          newType
        )
      )
    }

    this._logMessage = `paste types [${typeValuesList.map(
      ({ typeName, attributes }) =>
        [`{type:${typeName}}`].concat(
          attributes.map(({ pred, obj }) => `{${pred}:${obj}}`)
        )
    )}] to ${selecteedSpans}`
  }
}
