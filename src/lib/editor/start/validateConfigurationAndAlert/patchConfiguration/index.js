import AttributeConfigurationGenerator from './AttributeConfigurationGenerator'
import clone from './clone'

export default function(annotation, config) {
  console.assert(annotation)

  config = clone(config)
  config['attribute types'] = new AttributeConfigurationGenerator(
    annotation.attributes,
    config['attribute types']
  ).configuration

  return config
}
