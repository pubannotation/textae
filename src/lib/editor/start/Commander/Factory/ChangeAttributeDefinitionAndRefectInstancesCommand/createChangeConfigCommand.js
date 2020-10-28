import ChangeAttributeDefinitionCommand from './ChangeAttributeDefinitionCommand'

export default function(attrDef, typeContainer, changedProperties) {
  return new ChangeAttributeDefinitionCommand(
    typeContainer,
    attrDef,
    changedProperties
  )
}
