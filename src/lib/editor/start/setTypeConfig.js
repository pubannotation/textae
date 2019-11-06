export default function(typeDefinition, config) {
  if (config) {
    typeDefinition.setDefinedEntityTypes(config['entity types'])
    typeDefinition.setDefinedRelationTypes(config['relation types'])
  } else {
    typeDefinition.setDefinedEntityTypes()
    typeDefinition.setDefinedRelationTypes()
  }
}
