import alertifyjs from 'alertifyjs'
import warningIfBeginEndOfSpanAreNotInteger from '../../warningIfBeginEndOfSpanAreNotInteger'
import validateConfigurationAndAlert from '../../validateConfigurationAndAlert'
import toSourceString from '../../toSourceString'
import setAnnotationAndConfiguration from '../../setAnnotationAndConfiguration'

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
    .on(
      'textae-event.data-access-object.annotation.load.success',
      (dataSource) => {
        if (!dataSource.data.config && params.get('config')) {
          dataAccessObject.loadConfigulation(
            params.get('config'),
            dataSource.data
          )
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

            statusBar.status(dataSource)

            // When saving the changed data,
            // it keeps the original data so that properties not edited by textae are not lost.
            originalData.annotation = dataSource.data
            if (dataSource.data.config) {
              originalData.configuration = dataSource.data.config
            }
          }
        }
      }
    )
    .on(
      'textae-event.data-access-object.annotation.load.error',
      ({ displayName }) =>
        alertifyjs.error(
          `${displayName} is not a annotation file or its format is invalid.`
        )
    )
    .on(
      'textae-event.data-access-object.configuration.load.success',
      (sourceType, source, config, loadedAnnotation = null) => {
        // When config is specified, it must be JSON.
        // For example, when we load an HTML file, we treat it as text here.
        if (typeof config !== 'object') {
          alertifyjs.error(
            `${toSourceString(
              sourceType,
              source
            )} is not a configuration file or its format is invalid.`
          )
          return
        }

        if (loadedAnnotation) {
          warningIfBeginEndOfSpanAreNotInteger(loadedAnnotation)
        }

        // If an annotation that does not contain a configuration is loaded
        // and a configuration is loaded from a taxtae attribute value,
        // both the loaded configuration and the annotation are passed.
        // If only the configuration is read, the annotation is null.
        const annotation =
          loadedAnnotation ||
          Object.assign(originalData.annotation, annotationData.toJson())

        const validConfig = validateConfigurationAndAlert(annotation, config)

        if (!validConfig) {
          return
        }

        setAnnotationAndConfiguration(
          validConfig,
          buttonController,
          spanConfig,
          annotationData,
          annotation
        )

        if (sourceType === 'url') {
          dataAccessObject.configurationUrl = source
        }
      }
    )
    .on(
      'textae-event.data-access-object.configuration.load.error',
      (sourceType, source) =>
        alertifyjs.error(
          `${toSourceString(
            sourceType,
            source
          )} is not a configuration file or its format is invalid.!`
        )
    )
    .on('textae-event.data-access-object.configuration.save', () => {
      originalData.configuration = Object.assign(
        originalData.configuration,
        annotationData.typeDefinition.config
      )
    })
}
