import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import setConfigAndAnnotation from '../setConfigAndAnnotation'
import patchConfiguration from '../validateConfigurationAndAlert/patchConfiguration'
import validateAttribueDefinitionAndAlert from '../validateAttribueDefinitionAndAlert'
import setSpanAndTypeConfig from '../setSpanAndTypeConfig'

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

      if (validConfig) {
        setSpanAndTypeConfig(
          spanConfig,
          annotationData.typeDefinition,
          validConfig
        )
        annotationData.reset(annotation)
        return true
      }

      return false
    }
  }
}
