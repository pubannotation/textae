import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import setSpanAndTypeConfig from '../setSpanAndTypeConfig'
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

  const typeDefinition = annotationData.typeDefinition

  const validConfig = validateConfigurationAndAlert(
    annotation,
    config,
    errorMessageForConfigValidation
  )

  if (!validConfig) {
    return false
  }

  setPushBUttons(validConfig, buttonController)
  setSpanAndTypeConfig(spanConfig, typeDefinition, validConfig)
  annotationData.reset(annotation)
  return true
}
