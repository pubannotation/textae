import alertifyjs from 'alertifyjs'
import patchConfiguration from './patchConfiguration'
import validateConfiguration from './validateConfiguration'
import hasUndefinedAttributes from './hasUndefinedAttributes'

export default function(annotation, config, errorMessageForConfigValidation) {
  const patchedConfig = patchConfiguration(annotation, config)
  if (patchedConfig && !validateConfiguration(patchedConfig)) {
    alertifyjs.error(errorMessageForConfigValidation)
    return [false]
  }

  const error = hasUndefinedAttributes(annotation, patchedConfig)
  if (error) {
    alertifyjs.error(error)
    return [false]
  }

  return [true, patchedConfig]
}
