import alertifyjs from 'alertifyjs'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import setPushBUttons from '../setPushBUttons'

// Return true if the annotation is set.
export default function (
  spanConfig,
  annotationData,
  originalAnnotation,
  buttonController,
  okHandler
) {
  if (originalAnnotation.config) {
    // When config is specified, it must be JSON.
    // For example, when we load an HTML file, we treat it as text here.
    if (typeof originalAnnotation.config !== 'object') {
      alertifyjs.error(`configuration in anntotaion file is invalid.`)
      return
    }
  }

  const validConfig = validateConfigurationAndAlert(
    originalAnnotation,
    originalAnnotation.config
  )

  if (validConfig) {
    setPushBUttons(validConfig, buttonController)
    spanConfig.set(validConfig)
    annotationData.reset(originalAnnotation, validConfig)
    okHandler()
  }
}
