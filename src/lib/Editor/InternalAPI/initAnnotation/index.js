import alertifyjs from 'alertifyjs'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration.js'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert/index.js'
import warningIfBeginEndOfSpanAreNotInteger from '../warningIfBeginEndOfSpanAreNotInteger/index.js'
import DataSource from '../../DataSource/index.js'
import setDefault from './setDefault.js'

/**
 *
 * @param {import('../../ParamsFromHTMLElement/AnnotationParameter.js').default} annotationParameter
 */
export default function (
  spanConfig,
  annotationModel,
  remoteResource,
  controlViewModel,
  originalData,
  annotationParameter,
  configParameter,
  functionAvailability
) {
  if (annotationParameter.isInline) {
    // Set an inline annotation.
    const dataSource = new DataSource(
      'inline',
      null,
      annotationParameter.inlineAnnotation
    )

    if (!dataSource.data.config && configParameter) {
      remoteResource.loadConfiguration(configParameter, dataSource)
    } else {
      warningIfBeginEndOfSpanAreNotInteger(dataSource.data)

      if (dataSource.data.config) {
        // When config is specified, it must be JSON.
        // For example, when we load an HTML file, we treat it as text here.
        if (typeof dataSource.data.config !== 'object') {
          alertifyjs.error(`configuration in anntotaion file is invalid.`)
          return
        }
      }

      const validConfig = validateConfigurationAndAlert(
        dataSource.data,
        dataSource.data.config
      )

      if (validConfig) {
        setAnnotationAndConfiguration(
          validConfig,
          controlViewModel,
          spanConfig,
          annotationModel,
          dataSource.data,
          functionAvailability
        )

        originalData.annotation = dataSource
      }
    }
  } else if (annotationParameter.isRemote) {
    // Load an annotation from server.
    remoteResource.loadAnnotation(annotationParameter.URL)
  } else {
    if (configParameter) {
      remoteResource.loadConfiguration(configParameter)
    } else {
      setDefault(
        originalData,
        controlViewModel,
        spanConfig,
        annotationModel,
        functionAvailability
      )
    }
  }
}
