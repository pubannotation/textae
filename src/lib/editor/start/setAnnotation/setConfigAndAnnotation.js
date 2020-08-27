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
  const [isValid, patchedConfig] = validateConfigurationAndAlert(
    annotation,
    config,
    errorMessageForConfigValidation
  )
  if (isValid) {
    setSpanAndTypeConfig(spanConfig, typeDefinition, patchedConfig)
    annotationData.reset(annotation)
  }
}
