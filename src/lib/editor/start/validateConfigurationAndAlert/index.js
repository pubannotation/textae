import alertifyjs from 'alertifyjs'
import patchConfiguration from './patchConfiguration'
import validateConfiguration from './validateConfiguration'
import hasUndefinedAttributes from './hasUndefinedAttributes'

export default function(annotation, config, defaultErrorMessage) {
  const patchedConfig = patchConfiguration(annotation, config)
  if (patchedConfig) {
    const [isValid, errorMessage] = validateConfiguration(patchedConfig)
    if (!isValid) {
      alertifyjs.error(errorMessage || defaultErrorMessage)

      return [false]
    }
  }

  const error = hasUndefinedAttributes(annotation, patchedConfig)
  if (error) {
    alertifyjs.error(error)
    return [false]
  }

  return [true, patchedConfig]
}
