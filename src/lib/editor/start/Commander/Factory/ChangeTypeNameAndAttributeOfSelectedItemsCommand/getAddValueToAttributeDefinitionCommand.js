import AddValueToAttributeDefinitionCommand from '../AddValueToAttributeDefinitionCommand'

export default function (definitionContainer, attrDef, obj, label) {
  // When the value of the string attribute is acquired by auto-complete,
  // if the label of the acquired value is not registered in the attribute definition pattern,
  // it will be additionally registered.
  if (
    label &&
    attrDef.valueType === 'string' &&
    !attrDef.values.some((v) => v.pattern === obj)
  ) {
    return new AddValueToAttributeDefinitionCommand(
      definitionContainer,
      attrDef,
      {
        pattern: obj,
        label
      }
    )
  }
}
