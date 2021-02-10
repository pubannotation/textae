import alertifyjs from 'alertifyjs'
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

  // When config is specified, it must be JSON.
  // For example, when we load an HTML file, we treat it as text here.
  if (typeof config !== 'object') {
    alertifyjs.error(errorMessageForConfigValidation)
    return
  }

  const validConfig = validateConfigurationAndAlert(annotation, config)

  if (!validConfig) {
    return false
  }

  setPushBUttons(validConfig, buttonController)
  spanConfig.set(validConfig)
  annotationData.reset(annotation, validConfig)

  return true
}
