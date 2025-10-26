import alertifyjs from 'alertifyjs'
import patchConfiguration from '../patchConfiguration'
import validateAttributeDefinitionAndAlert from '../validateAttributeDefinitionAndAlert'
import validateConfiguration from './validateConfiguration'

export default function validateConfigurationAndAlert(annotation, config) {
  const patchedConfig = patchConfiguration(annotation, config)
  const errorMessage = validateConfiguration(patchedConfig)
  if (errorMessage) {
    alertifyjs.error(errorMessage)

    return
  }

  return validateAttributeDefinitionAndAlert(annotation, patchedConfig)
}
