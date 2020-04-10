import alertifyjs from 'alertifyjs'
import getConfigFromServer from './getConfigFromServer'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'
import patchConfiguration from './patchConfiguration'
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
    const patchedConfig = patchConfiguration(annotation, annotation.config)

    if (!validateConfiguration(patchedConfig)) {
      alertifyjs.error(`configuration in anntotaion file is invalid.`)
      return
    }

    const error = hasUndefinedAttributes(annotation, patchedConfig)
    if (error) {
      alertifyjs.error(error)
      return
    }

    setSpanAndTypeConfig(spanConfig, typeDefinition, patchedConfig)
    annotationData.reset(annotation)
  } else {
    getConfigFromServer(configUrl, (configFromServer) => {
      const patchedConfig = patchConfiguration(annotation, configFromServer)

      if (patchedConfig && !validateConfiguration(patchedConfig)) {
        alertifyjs.error(`a configuration file from ${configUrl} is invalid.`)
        return
      }

      const error = hasUndefinedAttributes(annotation, patchedConfig)
      if (error) {
        alertifyjs.error(error)
        return
      }

      setSpanAndTypeConfig(spanConfig, typeDefinition, patchedConfig)
      annotationData.reset(annotation)
    })
  }
}
