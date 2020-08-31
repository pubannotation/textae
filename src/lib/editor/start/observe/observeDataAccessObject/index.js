import alertifyjs from 'alertifyjs'
import setSpanAndTypeConfig from '../../setSpanAndTypeConfig'
import setAnnotation from '../../setAnnotation'
import validateConfigurationAndAlert from '../../validateConfigurationAndAlert'
import toSourceHTML from './toSourceHTML'

export default function(
  editor,
  spanConfig,
  typeDefinition,
  annotationData,
  params,
  statusBar,
  originalData
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
          params.get('config')
        )

        statusBar.status(toSourceHTML(sourceType, source))

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
        `${toSourceHTML(
          sourceType,
          source
        )} is not a annotation file or its format is invalid.`
      )
    )
    .on(
      'textae.dataAccessObject.configuration.load',
      (sourceType, source, config) => {
        const validConfig = validateConfigurationAndAlert(
          annotationData.toJson(),
          config,
          `${toSourceHTML(
            sourceType,
            source
          )} is not a configuration file or its format is invalid.`
        )
        if (!validConfig) return

        originalData.configuration = config
        setSpanAndTypeConfig(spanConfig, typeDefinition, validConfig)
      }
    )
    .on(
      'textae.dataAccessObject.configuration.loadError',
      (sourceType, source) =>
        alertifyjs.error(
          `${toSourceHTML(
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
