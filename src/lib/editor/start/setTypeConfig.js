import $ from 'jquery'

export default function(typeDefinition, config) {
  typeDefinition.setDefinedEntityTypes(config ? config['entity types'] : [])
  typeDefinition.setDefinedRelationTypes(config ? config['relation types'] : [])

  if (config && config.css !== undefined) {
    $('#css_area').html(`<link rel="stylesheet" href="${config.css}"/>`)
  }

  return config
}
