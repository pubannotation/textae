import alertifyjs from 'alertifyjs'
import setAnnotation from '../../setAnnotation'
import setConfigAndAnnotation from '../../setConfigAndAnnotation'
import toSourceString from './toSourceString'

export default function (
  editor,
  spanConfig,
  annotationData,
  params,
  statusBar,
  originalData,
  dataAccessObject,
  buttonController
) {
  editor.eventEmitter
    .on('textae.annotation.load', (sourceType, source, annotation) => {
      if (
        !setAnnotation(
          spanConfig,
          annotationData,
          annotation,
          params.get('config'),
          dataAccessObject,
          buttonController
        )
      ) {
        return
      }

      statusBar.status(toSourceString(sourceType, source))

      // When saving the changed data,
      // it keeps the original data so that properties not edited by textae are not lost.
      originalData.annotation = annotation
      if (annotation.config) {
        originalData.configuration = annotation.config
      }

      editor.eventEmitter.emit('textae.pallet.update')
    })
    .on('textae.annotation.loadError', (sourceType, source) =>
      alertifyjs.error(
        `${toSourceString(
          sourceType,
          source
        )} is not a annotation file or its format is invalid.`
      )
    )
    .on(
      'textae.configuration.load',
      (sourceType, source, config, loadedAnnotation = null) => {
        // If an annotation that does not contain a configuration is loaded
        // and a configuration is loaded from a taxtae attribute value,
        // both the loaded configuration and the annotation are passed.
        // If only the configuration is read, the annotation is null.
        const annotation =
          loadedAnnotation ||
          Object.assign(originalData.annotation, annotationData.toJson())

        if (
          setConfigAndAnnotation(
            annotation,
            config,
            `${toSourceString(
              sourceType,
              source
            )} is not a configuration file or its format is invalid.`,
            spanConfig,
            annotationData,
            buttonController
          )
        ) {
          if (sourceType === 'url') {
            dataAccessObject.configurationUrl = source
          }
        }
      }
    )
    .on('textae.configuration.loadError', (sourceType, source) =>
      alertifyjs.error(
        `${toSourceString(
          sourceType,
          source
        )} is not a configuration file or its format is invalid.`
      )
    )
    .on('textae.configuration.save', () => {
      originalData.configuration = Object.assign(
        originalData.configuration,
        annotationData.typeDefinition.config
      )
    })
}
