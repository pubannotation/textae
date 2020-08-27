import getConfigFromServer from './getConfigFromServer'
import validateAnnotationAndAlert from './validateAnnotationAndAlert'
import setConfigAndAnnotation from './setConfigAndAnnotation'

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
        setConfigAndAnnotation(
          annotation,
          null,
          `a configuration is necessary.`,
          spanConfig,
          typeDefinition,
          annotationData
        )
      }
    }
  }
}
