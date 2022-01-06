import alertifyjs from 'alertifyjs'
import setAnnotationAndConfiguration from './setAnnotationAndConfiguration'
import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import DataSource from '../DataSource'
import setDefault from './setDefault'

export default function (
  spanConfig,
  annotationData,
  params,
  dataAccessObject,
  buttonController,
  originalData
) {
  const annotationParameter = params.get('annotation')

  if (annotationParameter) {
    if (annotationParameter.has('inlineAnnotation')) {
      // Set an inline annotation.
      const dataSource = new DataSource(
        'inline',
        null,
        JSON.parse(annotationParameter.get('inlineAnnotation'))
      )

      if (!dataSource.data.config && params.get('config')) {
        dataAccessObject.loadConfigulation(params.get('config'), dataSource)
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
            buttonController,
            spanConfig,
            annotationData,
            dataSource.data
          )

          originalData.annotation = dataSource
        }
      }
    } else if (annotationParameter.has('url')) {
      // Load an annotation from server.
      dataAccessObject.loadAnnotation(annotationParameter.get('url'))
    } else {
      if (params.get('config')) {
        dataAccessObject.loadConfigulation(params.get('config'))
      } else {
        setDefault(originalData, buttonController, spanConfig, annotationData)
      }
    }
  }
}
