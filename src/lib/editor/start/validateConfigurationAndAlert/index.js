import alertifyjs from 'alertifyjs'
import patchConfiguration from './patchConfiguration'
import validateConfiguration from './validateConfiguration'
import hasUndefinedAttributes from './hasUndefinedAttributes'

export default function(annotation, config, defaultErrorMessage) {
  // When config is specified, it must be JSON.
  // For example, when we load an HTML file, we treat it as text here.
  if (config && typeof config !== 'object') {
    alertifyjs.error(defaultErrorMessage)
    return [false]
  }

  const patchedConfig = patchConfiguration(annotation, config)
  const [isValid, errorMessage] = validateConfiguration(patchedConfig)
  if (!isValid) {
    alertifyjs.error(errorMessage || defaultErrorMessage)

    return [false]
  }

  const error = hasUndefinedAttributes(annotation, patchedConfig)
  if (error) {
    alertifyjs.error(error)
    return [false]
  }

  return [true, patchedConfig]
}
