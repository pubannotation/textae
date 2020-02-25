import getConfigFromServer from './getConfigFromServer'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  configUrl
) {
  if (annotation.config) {
    setSpanAndTypeConfig(spanConfig, typeDefinition, annotation.config)
    annotationData.reset(annotation)
  } else {
    getConfigFromServer(configUrl, (configFromServer) => {
      setSpanAndTypeConfig(spanConfig, typeDefinition, configFromServer)
      annotationData.reset(annotation)
    })
  }
}
