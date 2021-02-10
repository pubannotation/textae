import setAnnotation from './setAnnotation'
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

        setAnnotation(
          spanConfig,
          annotationData,
          originalAnnotation,
          buttonController,
          () => statusBar.status('inline')
        )
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
        setAnnotation(
          spanConfig,
          annotationData,
          originalAnnotation,
          buttonController,
          () => {}
        )
      }

      return originalAnnotation
    }
  }

  return null
}
