import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'

export default function(
  annotation,
  config,
  errorMessageForConfigValidation,
  spanConfig,
  typeDefinition,
  annotationData
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

  setSpanAndTypeConfig(spanConfig, typeDefinition, validConfig)
  annotationData.reset(annotation)
  return true
}
