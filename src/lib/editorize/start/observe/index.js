import debounce from 'debounce'
import alertifyjs from 'alertifyjs'
import isTouchDevice from '../../isTouchDevice'
import observeMouse from './observeMouse'
import observeKey from './observeKey'
import warningIfBeginEndOfSpanAreNotInteger from '../warningIfBeginEndOfSpanAreNotInteger'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration'
import DataSource from '../../DataSource'

export default function (
  editor,
  history,
  annotationData,
  spanConfig,
  params,
  originalData,
  dataAccessObject,
  buttonController
) {
  editor.eventEmitter.on('textae-event.type-definition.reset', () =>
    history.resetConfiguration()
  )

  editor.eventEmitter.on('textae-event.history.change', (history) => {
    // change leaveMessage show
    // Reloading when trying to scroll further when you are at the top on an Android device.
    // Show a confirmation dialog to prevent this.
    window.onbeforeunload =
      isTouchDevice() || history.hasAnythingToSaveAnnotation ? () => true : null
  })

  editor.eventEmitter
    .on(
      'textae-event.data-access-object.annotation.load.success',
      (dataSource) => {
        if (!dataSource.data.config && params.get('config')) {
          dataAccessObject.loadConfigulation(params.get('config'), dataSource)
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

            originalData.annotation = dataSource
          }
        }
      }
    )
    .on('textae-event.data-access-object.annotation.load.error', (url) =>
      alertifyjs.error(
        `Could not load the file from the location you specified.: ${url}`
      )
    )
    .on(
      'textae-event.data-access-object.annotation.format.error',
      ({ displayName }) =>
        alertifyjs.error(
          `${displayName} is not a annotation file or its format is invalid.`
        )
    )
    .on(
      'textae-event.data-access-object.configuration.load.success',
      (dataSource, loadedAnnotation = null) => {
        // When config is specified, it must be JSON.
        // For example, when we load an HTML file, we treat it as text here.
        if (typeof dataSource.data !== 'object') {
          alertifyjs.error(
            `${dataSource.displayName} is not a configuration file or its format is invalid.`
          )
          return
        }

        if (loadedAnnotation) {
          warningIfBeginEndOfSpanAreNotInteger(loadedAnnotation.data)
        }

        // If an annotation that does not contain a configuration is loaded
        // and a configuration is loaded from a taxtae attribute value,
        // both the loaded configuration and the annotation are passed.
        // If only the configuration is read, the annotation is null.
        const annotation =
          (loadedAnnotation && loadedAnnotation.data) ||
          Object.assign(originalData.annotation, annotationData.toJson())

        const validConfig = validateConfigurationAndAlert(
          annotation,
          dataSource.data
        )

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

        if (loadedAnnotation) {
          originalData.annotation = loadedAnnotation
        }

        originalData.configuration = dataSource
      }
    )
    .on('textae-event.data-access-object.configuration.load.error', (url) =>
      alertifyjs.error(
        `Could not load the file from the location you specified.: ${url}`
      )
    )
    .on(
      'textae-event.data-access-object.configuration.format.error',
      ({ displayName }) =>
        alertifyjs.error(
          `${displayName} is not a configuration file or its format is invalid.!`
        )
    )
    .on('textae-event.data-access-object.configuration.save', (editedData) => {
      originalData.configuration = new DataSource(null, null, editedData)
    })

  observeMouse(editor)
  observeKey(editor)

  document.addEventListener(
    'selectionchange',
    debounce(() => editor.instanceMethods.applyTextSelection(), 100)
  )
  document.addEventListener('contextmenu', () =>
    editor.instanceMethods.applyTextSelection()
  )
}
