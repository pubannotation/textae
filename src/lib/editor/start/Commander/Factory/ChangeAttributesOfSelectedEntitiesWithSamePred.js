import CompositeCommand from './CompositeCommand'
import ChangeAttributeCommand from './ChangeAttributeCommand'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'

export default class extends CompositeCommand {
  constructor(
    annotationData,
    selectionModel,
    typeContainer,
    attrDef,
    newObj,
    newLabel = null
  ) {
    super()

    const selectedEntities = selectionModel.entity.all
    const selectedEntitiesWithSamePred = selectedEntities.filter((entity) =>
      entity.attributes.find((attribute) => attribute.pred === attrDef.pred)
    )

    const effectedAttributes = []
    for (const entity of selectedEntitiesWithSamePred) {
      const attribute = entity.attributes.find(
        (a) => a.pred == attrDef.pred && a.obj !== newObj
      )

      if (attribute) {
        effectedAttributes.push(
          new ChangeAttributeCommand(annotationData, attribute, null, newObj)
        )
      }
    }

    // When the value of the string attribute is acquired by auto-complete,
    // if the label of the acquired value is not registered in the attribute definition pattern,
    // it will be additionally registered.
    const addValueForLabelToStirngAttributeDefinitionCommands = []
    if (
      newLabel &&
      attrDef.valueType === 'string' &&
      !attrDef.JSON.values.some((v) => v.pattern === newObj)
    ) {
      addValueForLabelToStirngAttributeDefinitionCommands.push(
        new AddValueToAttributeDefinitionCommand(typeContainer, attrDef.JSON, {
          pattern: newObj,
          label: newLabel
        })
      )
    }

    this._subCommands = effectedAttributes.concat(
      addValueForLabelToStirngAttributeDefinitionCommands
    )
    this._logMessage = `update obj ${newObj} to attributes: ${effectedAttributes
      .map(
        ({ _attribute: attribute }) =>
          `{id: ${attribute.id}, subj: ${attribute.subj}, pred: ${attribute.pred}, obj: ${attribute.obj}}`
      )
      .join(',')}`
  }
}
