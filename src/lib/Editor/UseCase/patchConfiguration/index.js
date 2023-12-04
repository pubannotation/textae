import AttributeConfigurationGenerator from './AttributeConfigurationGenerator'
import clone from './clone'

export default function (annotation, config) {
  console.assert(annotation)

  // Note that if you don't make a copy, the reference to the original attribute types will be lost.
  config = clone(config)

  config['attribute types'] = new AttributeConfigurationGenerator(
    config['attribute types'],
    annotation.attributes
  ).configuration

  if (annotation.tracks) {
    for (const track of annotation.tracks) {
      config['attribute types'] = new AttributeConfigurationGenerator(
        config['attribute types'],
        track.attributes
      ).configuration
    }
  }

  return config
}
