import alertifyjs from 'alertifyjs'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import setPushBUttons from '../setPushBUttons'

// Return true if the annotation is set.
export default function (
  spanConfig,
  annotationData,
  annotation,
  loadConfigulationHandler,
  buttonController,
  okHandler
) {
  warningIfBeginEndOfSpanAreNotInteger(annotation)

  if (annotation.config) {
    // When config is specified, it must be JSON.
    // For example, when we load an HTML file, we treat it as text here.
    if (typeof annotation.config !== 'object') {
      alertifyjs.error(`configuration in anntotaion file is invalid.`)
      return
    }

    const validConfig = validateConfigurationAndAlert(
      annotation,
      annotation.config
    )

    if (!validConfig) {
      return
    }

    setPushBUttons(validConfig, buttonController)
    spanConfig.set(validConfig)
    annotationData.reset(annotation, validConfig)

    okHandler()
  } else {
    if (loadConfigulationHandler) {
      loadConfigulationHandler()
    } else {
      const validConfig = validateConfigurationAndAlert(annotation)

      if (validConfig) {
        spanConfig.set(validConfig)
        annotationData.reset(annotation, validConfig)
        okHandler()
      }
    }
  }
}
