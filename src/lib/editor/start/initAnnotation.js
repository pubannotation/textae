import setAnnotation from './setAnnotation'

export default function (
  spanConfig,
  annotationData,
  statusBar,
  params,
  dataAccessObject,
  buttonController
) {
  const annotation = params.get('annotation')
  const config = params.get('config')

  if (annotation) {
    if (annotation.has('inlineAnnotation')) {
      // Set an inline annotation.
      const originalAnnotation = JSON.parse(annotation.get('inlineAnnotation'))
      setAnnotation(
        spanConfig,
        annotationData,
        originalAnnotation,
        config,
        dataAccessObject,
        buttonController,
        () => statusBar.status('inline')
      )

      return originalAnnotation
    } else if (annotation.has('url')) {
      // Load an annotation from server.
      dataAccessObject.loadAnnotation(annotation.get('url'))
    } else {
      throw new Error('annotation text is empty.')
    }
  } else {
    // The annotation file may contain configuration.
    // When annotion is specified, configuration is not read immediately.
    // Read configuration when configuration is not included in the read annotation file.
    // If no annotation is specified, the configuration is read immediately.
    if (config) {
      dataAccessObject.loadConfigulation(config)
    }
  }

  return null
}
