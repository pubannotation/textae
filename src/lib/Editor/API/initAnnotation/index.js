import alertifyjs from 'alertifyjs'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import warningIfBeginEndOfSpanAreNotInteger from '../warningIfBeginEndOfSpanAreNotInteger'
import DataSource from '../../DataSource'
import setDefault from './setDefault'

/**
 *
 * @param {import('../../ParamsFromHTMLElement/AnnotationParameter.js').default} annotationParameter
 */
export default function (
  spanConfig,
  annotationData,
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
      remoteResource.loadConfigulation(configParameter, dataSource)
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
          annotationData,
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
      remoteResource.loadConfigulation(configParameter)
    } else {
      setDefault(
        originalData,
        controlViewModel,
        spanConfig,
        annotationData,
        functionAvailability
      )
    }
  }
}