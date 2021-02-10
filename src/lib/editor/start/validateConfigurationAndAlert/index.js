import alertifyjs from 'alertifyjs'
import patchConfiguration from '../patchConfiguration'
import validateConfiguration from './validateConfiguration'
import validateAttribueDefinitionAndAlert from '../validateAttribueDefinitionAndAlert'

export default function (annotation, config, defaultErrorMessage) {
  console.assert(config, 'config is necessary')

  // When config is specified, it must be JSON.
  // For example, when we load an HTML file, we treat it as text here.
  if (typeof config !== 'object') {
    alertifyjs.error(defaultErrorMessage)
    return
  }

  const patchedConfig = patchConfiguration(annotation, config)
  const errorMessage = validateConfiguration(patchedConfig)
  if (errorMessage) {
    alertifyjs.error(errorMessage)

    return
  }

  return validateAttribueDefinitionAndAlert(annotation, patchedConfig)
}
