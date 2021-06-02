import AddValueToAttributeDefinitionCommand from '../AddValueToAttributeDefinitionCommand'

export default function (definitionContainer, attrDef, obj, label) {
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
