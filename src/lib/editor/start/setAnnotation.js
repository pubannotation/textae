import alertifyjs from 'alertifyjs'
import getConfigFromServer from './getConfigFromServer'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'
import validateConfiguration from '../Model/AnnotationData/validateConfiguration'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  configUrl
) {
  if (annotation.config) {
    if (!validateConfiguration(annotation.config)) {
      alertifyjs.error(`configuration in anntotaion file is invalid.`)
      return
    }
    setSpanAndTypeConfig(spanConfig, typeDefinition, annotation.config)
    annotationData.reset(annotation)
  } else {
    getConfigFromServer(configUrl, (configFromServer) => {
      if (configFromServer && !validateConfiguration(configFromServer)) {
        alertifyjs.error(`a configuration file from ${configUrl} is invalid.`)
        return
      }
      setSpanAndTypeConfig(spanConfig, typeDefinition, configFromServer)
      annotationData.reset(annotation)
    })
  }
}
