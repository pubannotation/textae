import alertifyjs from 'alertifyjs'
import setPushBUttons from './setPushBUttons'
import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'

export default function (
  spanConfig,
  annotationData,
  statusBar,
  params,
  dataAccessObject,
  buttonController
) {
  const annotation = params.get('annotation')

  if (annotation) {
    if (annotation.has('inlineAnnotation')) {
      // Set an inline annotation.
      const originalAnnotation = JSON.parse(annotation.get('inlineAnnotation'))

      if (params.get('config') && !originalAnnotation.config) {
        dataAccessObject.loadConfigulation(
          params.get('config'),
          originalAnnotation
        )
      } else {
        warningIfBeginEndOfSpanAreNotInteger(originalAnnotation)

        if (originalAnnotation.config) {
          // When config is specified, it must be JSON.
          // For example, when we load an HTML file, we treat it as text here.
          if (typeof originalAnnotation.config !== 'object') {
            alertifyjs.error(`configuration in anntotaion file is invalid.`)
            return
          }
        }

        const validConfig = validateConfigurationAndAlert(
          originalAnnotation,
          originalAnnotation.config
        )

        if (validConfig) {
          setPushBUttons(validConfig, buttonController)
          spanConfig.set(validConfig)
          annotationData.reset(originalAnnotation, validConfig)
          statusBar.status('inline')
        }
      }

      return originalAnnotation
    } else if (annotation.has('url')) {
      // Load an annotation from server.
      dataAccessObject.loadAnnotation(annotation.get('url'))
    } else {
      const originalAnnotation = {
        text:
          'Currently, the document is empty. Use the `import` button or press the key `i` to open a document with annotation.'
      }

      if (params.get('config')) {
        dataAccessObject.loadConfigulation(
          params.get('config'),
          originalAnnotation
        )
      } else {
        const validConfig = validateConfigurationAndAlert(originalAnnotation)

        if (validConfig) {
          setPushBUttons(validConfig, buttonController)
          spanConfig.set(validConfig)
          annotationData.reset(originalAnnotation, validConfig)
        }
      }

      return originalAnnotation
    }
  }

  return null
}
