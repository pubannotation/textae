import alertifyjs from 'alertifyjs'
import setSpanAndTypeConfig from '../setSpanAndTypeConfig'
import patchConfiguration from '../patchConfiguration'
import validateConfiguration from '../validateConfiguration'
import hasUndefinedAttributes from '../hasUndefinedAttributes'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  config,
  errorMessageForConfigValidation
) {
  const patchedConfig = patchConfiguration(annotation, config)
  if (patchedConfig && !validateConfiguration(patchedConfig)) {
    alertifyjs.error(errorMessageForConfigValidation)
    return
  }

  const error = hasUndefinedAttributes(annotation, patchedConfig)
  if (error) {
    alertifyjs.error(error)
    return
  }

  setSpanAndTypeConfig(spanConfig, typeDefinition, patchedConfig)
  annotationData.reset(annotation)
}
