import alertifyjs from 'alertifyjs'

import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration.js'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert/index.js'
import warningIfBeginEndOfSpanAreNotInteger from '../warningIfBeginEndOfSpanAreNotInteger/index.js'

export default function setLoadedAnnotation(
  eventEmitter,
  dataSource,
  configurationURL,
  remoteResource,
  menuState,
  spanConfig,
  annotationModel,
  functionAvailability,
  originalData
) {
  if (!dataSource.data.config && configurationURL) {
    remoteResource.loadConfiguration(configurationURL, dataSource)
  } else {
    warningIfBeginEndOfSpanAreNotInteger(dataSource.data)

    if (dataSource.data.config) {
      // When config is specified, it must be JSON.
      // For example, when we load an HTML file, we treat it as text here.
      if (typeof dataSource.data.config !== 'object') {
        alertifyjs.error(`configuration in annotation file is invalid.`)
        return
      }
    }

    const validConfig = validateConfigurationAndAlert(
      dataSource.data,
      dataSource.data.config
    )

    if (validConfig) {
      setAnnotationAndConfiguration(
        eventEmitter,
        validConfig,
        menuState,
        spanConfig,
        annotationModel,
        dataSource.data,
        functionAvailability
      )

      originalData.annotation = dataSource
    }
  }
}
