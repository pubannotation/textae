import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import CompositeCommand from './CompositeCommand'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'

export default class PasteTypesToSelectedSpansCommand extends CompositeCommand {
  constructor(
    annotationModel,
    selectionModel,
    typeValuesList,
    newTypes,
    attrDefs,
    newSelectionAttributeObjects
  ) {
    super()

    const selecteedSpans = selectionModel.span.all.map((span) => span.id)
    this._subCommands = []

    for (const newType of newTypes) {
      this._subCommands.push(
        new CreateTypeDefinitionCommand(
          annotationModel.denotationDefinitionContainer,
          newType
        )
      )
    }

    for (const attrDef of attrDefs) {
      this._subCommands.push(
        new CreateAttributeDefinitionCommand(
          annotationModel.attributeDefinitionContainer,
          { valueType: attrDef['value type'], ...attrDef }
        )
      )
    }

    for (const { pred, value } of newSelectionAttributeObjects) {
      this._subCommands.push(
        new AddValueToAttributeDefinitionCommand(
          annotationModel.attributeDefinitionContainer,
          annotationModel.attributeDefinitionContainer.get(pred),
          value
        )
      )
    }

    this._subCommands = this._subCommands.concat(
      selecteedSpans
        .map((span) =>
          typeValuesList.map(
            (typeValues) =>
              new CreateEntityAndAttributesCommand(
                annotationModel,
                selectionModel,
                span,
                typeValues.typeName,
                typeValues.attributes
              )
          )
        )
        .flat()
    )

    this._logMessage = `paste types [${typeValuesList.map(
      ({ typeName, attributes }) =>
        [`{type:${typeName}}`].concat(
          attributes.map(({ pred, obj }) => `{${pred}:${obj}}`)
        )
    )}] to ${selecteedSpans}`
  }
}
