import getConfigFromServer from './getConfigFromServer'
import setConfigAndAnnotation from './setConfigAndAnnotation'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  configUrl
) {
  if (annotation.config) {
    setConfigAndAnnotation(
      spanConfig,
      typeDefinition,
      annotationData,
      annotation,
      annotation.config,
      `configuration in anntotaion file is invalid.`
    )
  } else {
    getConfigFromServer(configUrl, (configFromServer) => {
      setConfigAndAnnotation(
        spanConfig,
        typeDefinition,
        annotationData,
        annotation,
        configFromServer,
        `a configuration file from ${configUrl} is invalid.`
      )
    })
  }
}
