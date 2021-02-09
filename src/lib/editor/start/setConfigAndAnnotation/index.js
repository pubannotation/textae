import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import setPushBUttons from './setPushBUttons'

export default function (
  annotation,
  config,
  errorMessageForConfigValidation,
  spanConfig,
  annotationData,
  buttonController
) {
  console.assert(config, 'config is necessary')

  const validConfig = validateConfigurationAndAlert(
    annotation,
    config,
    errorMessageForConfigValidation
  )

  if (!validConfig) {
    return false
  }

  setPushBUttons(validConfig, buttonController)
  spanConfig.set(validConfig)
  annotationData.typeDefinition.setTypeConfig(validConfig)
  annotationData.reset(annotation)

  return true
}
