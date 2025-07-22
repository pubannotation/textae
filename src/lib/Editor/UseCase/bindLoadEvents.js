import alertifyjs from 'alertifyjs'
import setAnnotationAndConfiguration from './setAnnotationAndConfiguration'
import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'

export default function bindLoadEvents(
  eventEmitter,
  startUpOptions,
  remoteResource,
  menuState,
  spanConfig,
  annotationModel,
  functionAvailability,
  originalData
) {
  eventEmitter
    .on('textae-event.resource.annotation.load.success', (dataSource) => {
      if (!dataSource.data.config && startUpOptions.config) {
        remoteResource.loadConfiguration(startUpOptions.config, dataSource)
      } else {
        warningIfBeginEndOfSpanAreNotInteger(dataSource.data)

        if (dataSource.data.config) {
          // When config is specified, it must be JSON.
          // For example, when we load an HTML file, we treat it as text here.
          if (typeof dataSource.data.config !== 'object') {
            alertifyjs.error(`configuration in annotation file is invalid.`)
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
            menuState,
            spanConfig,
            annotationModel,
            dataSource.data,
            functionAvailability
          )
          eventEmitter.emit('textae-event.configuration.reset')

          if (startUpOptions.isFocusFirstDenotation) {
            const firstDenotation =
              annotationModel.spanInstanceContainer.allDenotationSpans.at(0)
            if (firstDenotation) {
              firstDenotation.focus()
            }
          }

          originalData.annotation = dataSource
        }
      }
    })
    .on(
      'textae-event.resource.configuration.load.success',
      (configurationDataSource, annotationDataSource = null) => {
        // When config is specified, it must be JSON.
        // For example, when we load an HTML file, we treat it as text here.
        if (typeof configurationDataSource.data !== 'object') {
          alertifyjs.error(
            `${configurationDataSource.displayName} is not a configuration file or its format is invalid.`
          )
          return
        }

        if (annotationDataSource) {
          warningIfBeginEndOfSpanAreNotInteger(annotationDataSource.data)
        }

        // If an annotation that does not contain a configuration is loaded
        // and a configuration is loaded from a textae attribute value,
        // both the loaded configuration and the annotation are passed.
        // If only the configuration is read, the annotation is null.
        const annotation = (annotationDataSource &&
          annotationDataSource.data) || {
          ...originalData.annotation,
          ...annotationModel.externalFormat
        }

        const validConfig = validateConfigurationAndAlert(
          annotation,
          configurationDataSource.data
        )

        if (!validConfig) {
          return
        }

        setAnnotationAndConfiguration(
          validConfig,
          menuState,
          spanConfig,
          annotationModel,
          annotation,
          functionAvailability
        )
        eventEmitter.emit('textae-event.configuration.reset')

        if (annotationDataSource) {
          originalData.annotation = annotationDataSource
        }

        originalData.configuration = configurationDataSource
      }
    )
}
