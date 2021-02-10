import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import setPushBUttons from '../setPushBUttons'

export default function (
  annotation,
  config,
  spanConfig,
  annotationData,
  buttonController
) {
  console.assert(config, 'config is necessary')

  const validConfig = validateConfigurationAndAlert(annotation, config)

  if (!validConfig) {
    return false
  }

  setPushBUttons(validConfig, buttonController)
  spanConfig.set(validConfig)
  annotationData.reset(annotation, validConfig)

  return true
}
