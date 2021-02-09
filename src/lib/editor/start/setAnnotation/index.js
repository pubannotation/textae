import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import setConfigAndAnnotation from '../setConfigAndAnnotation'
import patchConfiguration from '../validateConfigurationAndAlert/patchConfiguration'
import validateAttribueDefinitionAndAlert from '../validateAttribueDefinitionAndAlert'

// Return true if the annotation is set.
export default function (
  spanConfig,
  annotationData,
  annotation,
  configUrl,
  dataAccessObject,
  buttonController
) {
  warningIfBeginEndOfSpanAreNotInteger(annotation)

  if (annotation.config) {
    return setConfigAndAnnotation(
      annotation,
      annotation.config,
      `configuration in anntotaion file is invalid.`,
      spanConfig,
      annotationData,
      buttonController
    )
  } else {
    if (configUrl) {
      dataAccessObject.loadConfigulation(configUrl, annotation)
    } else {
      const patchedConfig = patchConfiguration(annotation)
      const validConfig = validateAttribueDefinitionAndAlert(
        annotation,
        patchedConfig
      )

      if (!validConfig) {
        return
      }

      spanConfig.set(validConfig)
      annotationData.typeDefinition.setTypeConfig(validConfig)
      annotationData.reset(annotation)

      return true
    }
  }
}
