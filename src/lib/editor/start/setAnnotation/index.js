import getConfigFromServer from './getConfigFromServer'
import validateAnnotationAndAlert from './validateAnnotationAndAlert'
import setConfigAndAnnotation from './setConfigAndAnnotation'
import patchConfiguration from '../validateConfigurationAndAlert/patchConfiguration'
import validateAttribueDefinitionAndAlert from '../validateAttribueDefinitionAndAlert'
import setSpanAndTypeConfig from '../setSpanAndTypeConfig'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  configUrl
) {
  if (validateAnnotationAndAlert(annotation)) {
    if (annotation.config) {
      setConfigAndAnnotation(
        annotation,
        annotation.config,
        `configuration in anntotaion file is invalid.`,
        spanConfig,
        typeDefinition,
        annotationData
      )
    } else {
      if (configUrl) {
        getConfigFromServer(configUrl, (configFromServer) => {
          setConfigAndAnnotation(
            annotation,
            configFromServer,
            `a configuration file from ${configUrl} is invalid.`,
            spanConfig,
            typeDefinition,
            annotationData
          )
        })
      } else {
        const patchedConfig = patchConfiguration(annotation)
        const validConfig = validateAttribueDefinitionAndAlert(
          annotation,
          patchedConfig
        )
        if (validConfig) {
          setSpanAndTypeConfig(spanConfig, typeDefinition, validConfig)
          annotationData.reset(annotation)
        }
      }
    }
  }
}
