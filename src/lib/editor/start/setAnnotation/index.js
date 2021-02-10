import alertifyjs from 'alertifyjs'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import setConfigAndAnnotation from '../setConfigAndAnnotation'
import patchConfiguration from '../patchConfiguration'
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
    // When config is specified, it must be JSON.
    // For example, when we load an HTML file, we treat it as text here.
    if (typeof annotation.config !== 'object') {
      alertifyjs.error(`configuration in anntotaion file is invalid.`)
      return
    }

    if (
      setConfigAndAnnotation(
        annotation,
        annotation.config,
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
