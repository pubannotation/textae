import alertifyjs from 'alertifyjs'
import SpanConfig from './SpanConfig'
import Commander from './Commander'
import Presenter from './Presenter'
import PersistenceInterface from './PersistenceInterface'
import initAnnotation from './initAnnotation'
import OriginalData from './OriginalData'
import ButtonController from './ButtonController'
import Clipboard from './Clipboard'
import AnnotationAutoSaver from './AnnotationAutoSaver'
import ControlBar from '../control/ControlBar'
import ContextMenu from '../control/ContextMenu'
import KeyEventMap from './KeyEventMap'
import IconEventMap from './IconEventMap'
import AnnotationDataEventsObserver from '../AnnotationDataEventsObserver'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import setAnnotationAndConfiguration from './setAnnotationAndConfiguration'
import DataSource from '../DataSource'
import RemoteResource from '../RemoteResource'

export default function (
  editorHTMLElement,
  editorID,
  eventEmitter,
  annotationData,
  selectionModel,
  params
) {
  const spanConfig = new SpanConfig()

  // Users can edit model only via commands.
  const commander = new Commander(
    editorHTMLElement,
    editorID,
    eventEmitter,
    annotationData,
    selectionModel
  )
  const clipBoard = new Clipboard(
    eventEmitter,
    commander,
    selectionModel,
    annotationData.denotationDefinitionContainer,
    annotationData.attributeDefinitionContainer,
    annotationData.typeDefinition
  )
  const originalData = new OriginalData(
    eventEmitter,
    editorHTMLElement,
    params.get('status_bar')
  )
  const annotationDataEventsObserver = new AnnotationDataEventsObserver(
    eventEmitter,
    originalData,
    annotationData
  )
  const buttonController = new ButtonController(
    eventEmitter,
    selectionModel,
    clipBoard,
    annotationDataEventsObserver,
    originalData,
    annotationData.typeDefinition
  )
  const presenter = new Presenter(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    buttonController,
    params.get('autocompletion_ws'),
    params.get('mode')
  )

  if (params.has('config_lock') && params.get('config_lock') === 'true') {
    annotationData.typeDefinition.lockEdit()
  } else {
    annotationData.typeDefinition.unlockEdit()
  }

  const remoteResource = new RemoteResource(eventEmitter)
  initAnnotation(
    spanConfig,
    annotationData,
    remoteResource,
    buttonController,
    originalData,
    params.get('annotation'),
    params.get('config')
  )

  const persistenceInterface = new PersistenceInterface(
    eventEmitter,
    remoteResource,
    annotationData,
    () => originalData.annotation,
    () => originalData.configuration,
    params.get('annotation').get('save_to'),
    annotationDataEventsObserver,
    buttonController
  )

  new AnnotationAutoSaver(
    eventEmitter,
    buttonController,
    persistenceInterface,
    params.get('annotation').get('save_to'),
    annotationDataEventsObserver
  )

  eventEmitter
    .on('textae-event.resource.annotation.load.success', (dataSource) => {
      if (!dataSource.data.config && params.get('config')) {
        remoteResource.loadConfigulation(params.get('config'), dataSource)
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
          remoteResource.annotationUrl = dataSource
        }
      }
    })
    .on(
      'textae-event.resource.configuration.load.success',
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
        const annotation = (loadedAnnotation && loadedAnnotation.data) || {
          ...originalData.annotation,
          ...annotationData.JSON
        }

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
        remoteResource.configurationUrl = dataSource
      }
    )
    .on('textae-event.resource.annotation.save', (editedData) => {
      originalData.annotation = new DataSource(null, null, editedData)
    })
    .on('textae-event.resource.configuration.save', (editedData) => {
      originalData.configuration = new DataSource(null, null, editedData)
    })
    .on('textae-event.pallet.read-button.click', () =>
      persistenceInterface.importConfiguration()
    )
    .on('textae-event.pallet.write-button.click', () =>
      persistenceInterface.uploadConfiguration()
    )

  // Add tabIndex to listen to keyboard events.
  editorHTMLElement.tabIndex = -1

  const iconEventMap = new IconEventMap(
    commander,
    presenter,
    persistenceInterface,
    buttonController,
    annotationData
  )

  // add control bar
  editorHTMLElement.insertBefore(
    new ControlBar(eventEmitter, buttonController, iconEventMap).el,
    editorHTMLElement.childNodes[0]
  )
  // add context menu
  const contextMenu = new ContextMenu(
    editorHTMLElement,
    buttonController,
    iconEventMap
  )
  editorHTMLElement.appendChild(contextMenu.el)

  editorHTMLElement.addEventListener('keyup', (event) => {
    contextMenu.hide()

    if (presenter.isActive) {
      new KeyEventMap(commander, presenter, persistenceInterface).handle(event)
    }
  })

  return presenter
}
