import alertifyjs from 'alertifyjs'
import patchConfiguration from './patchConfiguration'
import validateConfiguration from './validateConfiguration'
import hasAllValueDefinitionOfSelectionAttributes from './hasAllValueDefinitionOfSelectionAttributes'

export default function(annotation, config, defaultErrorMessage) {
  // When config is specified, it must be JSON.
  // For example, when we load an HTML file, we treat it as text here.
  if (config && typeof config !== 'object') {
    alertifyjs.error(defaultErrorMessage)
    return
  }

  const patchedConfig = patchConfiguration(annotation, config)
  if (config) {
    const errorMessage = validateConfiguration(patchedConfig)
    if (errorMessage) {
      alertifyjs.error(errorMessage)

      return
    }
  }

  const error = hasAllValueDefinitionOfSelectionAttributes(
    annotation,
    patchedConfig
  )
  if (error) {
    alertifyjs.error(error)
    return
  }

  return patchedConfig
}
