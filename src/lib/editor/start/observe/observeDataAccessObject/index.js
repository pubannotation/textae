import alertifyjs from 'alertifyjs'
import setAnnotation from '../../setAnnotation'
import setConfigAndAnnotation from '../../setConfigAndAnnotation'
import toSourceString from './toSourceString'

export default function(
  editor,
  spanConfig,
  typeDefinition,
  annotationData,
  params,
  statusBar,
  originalData,
  dataAccessObject
) {
  editor.eventEmitter
    .on(
      'textae.dataAccessObject.annotation.load',
      (sourceType, source, annotation) => {
        setAnnotation(
          spanConfig,
          typeDefinition,
          annotationData,
          annotation,
          params.get('config'),
          dataAccessObject
        )

        statusBar.status(toSourceString(sourceType, source))

        // When saving the changed data,
        // it keeps the original data so that properties not edited by textae are not lost.
        originalData.annotation = annotation
        if (annotation.config) {
          originalData.configuration = annotation.config
        }

        editor.eventEmitter.emit('textae.pallet.update')
      }
    )
    .on('textae.dataAccessObject.annotation.loadError', (sourceType, source) =>
      alertifyjs.error(
        `${toSourceString(
          sourceType,
          source
        )} is not a annotation file or its format is invalid.`
      )
    )
    .on(
      'textae.dataAccessObject.configuration.load',
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
            typeDefinition,
            annotationData
          )
        ) {
          if (sourceType === 'url') {
            dataAccessObject.configurationUrl = source
          }
        }
      }
    )
    .on(
      'textae.dataAccessObject.configuration.loadError',
      (sourceType, source) =>
        alertifyjs.error(
          `${toSourceString(
            sourceType,
            source
          )} is not a configuration file or its format is invalid.`
        )
    )
    .on('textae.dataAccessObject.configuration.save', () => {
      originalData.configuration = Object.assign(
        originalData.configuration,
        typeDefinition.config
      )
    })
}
