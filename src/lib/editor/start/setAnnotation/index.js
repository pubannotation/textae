import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import setConfigAndAnnotation from '../setConfigAndAnnotation'
import patchConfiguration from '../validateConfigurationAndAlert/patchConfiguration'
import validateAttribueDefinitionAndAlert from '../validateAttribueDefinitionAndAlert'

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
    if (
      setConfigAndAnnotation(
        annotation,
        annotation.config,
        `configuration in anntotaion file is invalid.`,
        spanConfig,
        annotationData,
        buttonController
      )
    ) {
      okHandler()
    }
  } else {
    if (loadConfigulationHandler) {
      loadConfigulationHandler()
    } else {
      const patchedConfig = patchConfiguration(annotation)
      const validConfig = validateAttribueDefinitionAndAlert(
        annotation,
        patchedConfig
      )

      if (validConfig) {
        spanConfig.set(validConfig)
        annotationData.reset(annotation, validConfig)
        okHandler()
      }
    }
  }
}
