import alertifyjs from 'alertifyjs'
import setAnnotation from '../../setAnnotation'
import warningIfBeginEndOfSpanAreNotInteger from '../../warningIfBeginEndOfSpanAreNotInteger'
import setPushBUttons from '../../setPushBUttons'
import validateConfigurationAndAlert from '../../validateConfigurationAndAlert'
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
    .on(
      'textae-event.data-access-object.annotation.load.success',
      (sourceType, source, annotation) => {
        warningIfBeginEndOfSpanAreNotInteger(annotation)

        if (params.get('config') && !annotation.config) {
          dataAccessObject.loadConfigulation(params.get('config'), annotation)
        } else {
          setAnnotation(
            spanConfig,
            annotationData,
            annotation,
            buttonController,
            () => {
              statusBar.status(toSourceString(sourceType, source))

              // When saving the changed data,
              // it keeps the original data so that properties not edited by textae are not lost.
              originalData.annotation = annotation
              if (annotation.config) {
                originalData.configuration = annotation.config
              }
            }
          )
        }
      }
    )
    .on(
      'textae-event.data-access-object.annotation.load.error',
      (sourceType, source) =>
        alertifyjs.error(
          `${toSourceString(
            sourceType,
            source
          )} is not a annotation file or its format is invalid.`
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

        setPushBUttons(validConfig, buttonController)
        spanConfig.set(validConfig)
        annotationData.reset(annotation, validConfig)

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
