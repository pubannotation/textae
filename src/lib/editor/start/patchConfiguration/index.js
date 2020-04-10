import AttributeConfigurationGenerator from './AttributeConfigurationGenerator'
import merge from './merge'

export default function(annotation, config) {
  console.assert(annotation)

  return merge(
    config,
    new AttributeConfigurationGenerator(annotation.attributes).configuration
  )
}
