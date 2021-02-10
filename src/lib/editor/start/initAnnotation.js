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

  if (annotation) {
    if (annotation.has('inlineAnnotation')) {
      // Set an inline annotation.
      const originalAnnotation = JSON.parse(annotation.get('inlineAnnotation'))
      setAnnotation(
        spanConfig,
        annotationData,
        originalAnnotation,
        params.get('config')
          ? () =>
              dataAccessObject.loadConfigulation(
                params.get('config'),
                originalAnnotation
              )
          : null,
        buttonController,
        () => statusBar.status('inline')
      )

      return originalAnnotation
    } else if (annotation.has('url')) {
      // Load an annotation from server.
      dataAccessObject.loadAnnotation(annotation.get('url'))
    } else {
      const originalAnnotation = {
        text:
          'Currently, the document is empty. Use the `import` button or press the key `i` to open a document with annotation.'
      }

      setAnnotation(
        spanConfig,
        annotationData,
        originalAnnotation,
        params.get('config')
          ? () =>
              dataAccessObject.loadConfigulation(
                params.get('config'),
                originalAnnotation
              )
          : null,
        buttonController,
        () => {}
      )

      return originalAnnotation
    }
  }

  return null
}
