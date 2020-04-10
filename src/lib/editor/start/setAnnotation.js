import alertifyjs from 'alertifyjs'
import getConfigFromServer from './getConfigFromServer'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'
import validateConfiguration from './validateConfiguration'
import hasUndefinedAttributes from './hasUndefinedAttributes'

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

    const error = hasUndefinedAttributes(annotation, annotation.config)
    if (error) {
      alertifyjs.error(error)
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

      const error = hasUndefinedAttributes(annotation, configFromServer)
      if (error) {
        alertifyjs.error(error)
        return
      }

      setSpanAndTypeConfig(spanConfig, typeDefinition, configFromServer)
      annotationData.reset(annotation)
    })
  }
}
