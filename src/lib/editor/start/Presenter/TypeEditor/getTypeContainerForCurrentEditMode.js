export default function(elementEditor, typeDefinition) {
  return elementEditor.getHandlerType() == 'entity'
    ? typeDefinition.entity
    : elementEditor.getHandlerType() == 'relation'
    ? typeDefinition.relation
    : null
}
