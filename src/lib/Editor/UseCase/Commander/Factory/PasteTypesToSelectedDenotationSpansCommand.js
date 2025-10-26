import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import CompositeCommand from './CompositeCommand'
import CreateAttributeDefinitionCommand from './CreateAttributeDefinitionCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'

export default class PasteTypesToSelectedDenotationSpansCommand extends CompositeCommand {
  constructor(
    annotationModel,
    selectionModel,
    typeValuesList,
    newTypes,
    attrDefs,
    newSelectionAttributeObjects
  ) {
    super()

    const selectedSpans = selectionModel.span.all
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
          annotationModel.attributeInstanceContainerDefinitionContainer,
          { valueType: attrDef['value type'], ...attrDef }
        )
      )
    }

    for (const { pred, value } of newSelectionAttributeObjects) {
      this._subCommands.push(
        new AddValueToAttributeDefinitionCommand(
          annotationModel.attributeInstanceContainerDefinitionContainer,
          annotationModel.attributeInstanceContainerDefinitionContainer.get(
            pred
          ),
          value
        )
      )
    }

    this._subCommands = this._subCommands.concat(
      selectedSpans.flatMap((span) =>
        typeValuesList.map(
          (typeValues) =>
            new CreateEntityAndAttributesCommand(
              annotationModel,
              selectionModel,
              'denotation',
              span.begin,
              span.end,
              typeValues.typeName,
              typeValues.attributes
            )
        )
      )
    )

    this._logMessage = `paste types [${typeValuesList.map(
      ({ typeName, attributes }) =>
        [`{type:${typeName}}`].concat(
          attributes.map(({ pred, obj }) => `{${pred}:${obj}}`)
        )
    )}] to ${selectedSpans}`
  }
}
