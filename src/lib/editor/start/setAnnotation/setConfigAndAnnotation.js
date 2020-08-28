import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import setSpanAndTypeConfig from '../setSpanAndTypeConfig'

export default function(
  annotation,
  config,
  errorMessageForConfigValidation,
  spanConfig,
  typeDefinition,
  annotationData
) {
  const validConfig = validateConfigurationAndAlert(
    annotation,
    config,
    errorMessageForConfigValidation
  )

  if (validConfig) {
    setSpanAndTypeConfig(spanConfig, typeDefinition, validConfig)
    annotationData.reset(annotation)
  }
}
