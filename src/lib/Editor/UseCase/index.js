import alertifyjs from 'alertifyjs'
import SpanConfig from './SpanConfig'
import Commander from './Commander'
import Presenter from './Presenter'
import PersistenceInterface from './PersistenceInterface'
import initAnnotation from './initAnnotation'
import OriginalData from './OriginalData'
import ControlViewModel from './ControlViewModel'
import Clipboard from './Clipboard'
import AnnotationAutoSaver from './AnnotationAutoSaver'
import ControlBar from '../control/ControlBar'
import ContextMenu from '../control/ContextMenu'
import KeyEventMap from './KeyEventMap'
import IconEventMap from './IconEventMap'
import AnnotationModelEventsObserver from '../AnnotationModelEventsObserver'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import setAnnotationAndConfiguration from './setAnnotationAndConfiguration'
import RemoteResource from '../RemoteResource'
import forwardMethods from '../forwardMethods'
import FunctionAvailability from './FunctionAvailability'

export default class UseCase {
  #contextMenu

  /**
   *
   * @param {import('../HTMLInlineOptions').HTMLInlineOption} inlineOptions
   */
  constructor(
    editorHTMLElement,
    editorID,
    mousePoint,
    eventEmitter,
    annotationModel,
    inlineOptions,
    selectionModel
  ) {
    const spanConfig = new SpanConfig()

    // Users can edit model only via commands.
    const commander = new Commander(
      editorHTMLElement,
      editorID,
      eventEmitter,
      annotationModel,
      selectionModel
    )
    const clipBoard = new Clipboard(
      eventEmitter,
      commander,
      selectionModel,
      annotationModel.denotationDefinitionContainer,
      annotationModel.attributeDefinitionContainer,
      annotationModel.typeDefinition
    )
    const originalData = new OriginalData(
      eventEmitter,
      editorHTMLElement,
      inlineOptions.statusBar
    )

    const annotationModelEventsObserver = new AnnotationModelEventsObserver(
      eventEmitter,
      originalData,
      annotationModel
    )
    const functionAvailability = new FunctionAvailability()
    const controlViewModel = new ControlViewModel(
      eventEmitter,
      selectionModel,
      clipBoard,
      annotationModelEventsObserver,
      originalData,
      annotationModel.typeDefinition,
      functionAvailability
    )
    const presenter = new Presenter(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      spanConfig,
      clipBoard,
      controlViewModel,
      inlineOptions,
      functionAvailability,
      mousePoint
    )

    const remoteResource = new RemoteResource(eventEmitter)

    const persistenceInterface = new PersistenceInterface(
      eventEmitter,
      remoteResource,
      annotationModel,
      () => originalData.annotation,
      () => originalData.configuration,
      inlineOptions.saveTo,
      annotationModelEventsObserver,
      controlViewModel
    )

    new AnnotationAutoSaver(
      eventEmitter,
      controlViewModel,
      persistenceInterface,
      inlineOptions.saveTo,
      annotationModelEventsObserver
    )

    eventEmitter
      .on('textae-event.resource.annotation.load.success', (dataSource) => {
        if (!dataSource.data.config && inlineOptions.config) {
          remoteResource.loadConfiguration(inlineOptions.config, dataSource)
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
              controlViewModel,
              spanConfig,
              annotationModel,
              dataSource.data,
              functionAvailability
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
          // and a configuration is loaded from a textae attribute value,
          // both the loaded configuration and the annotation are passed.
          // If only the configuration is read, the annotation is null.
          const annotation = (loadedAnnotation && loadedAnnotation.data) || {
            ...originalData.annotation,
            ...annotationModel.externalFormat
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
            controlViewModel,
            spanConfig,
            annotationModel,
            annotation,
            functionAvailability
          )

          if (loadedAnnotation) {
            originalData.annotation = loadedAnnotation
            remoteResource.annotationUrl = loadedAnnotation
          }

          originalData.configuration = dataSource
          remoteResource.configurationUrl = dataSource
        }
      )

    const iconEventMap = new IconEventMap(
      commander,
      presenter,
      persistenceInterface,
      controlViewModel,
      annotationModel
    )

    // add control bar
    const controlBarHTMLElement = new ControlBar(
      eventEmitter,
      controlViewModel,
      iconEventMap
    ).el
    editorHTMLElement.insertBefore(
      controlBarHTMLElement,
      editorHTMLElement.childNodes[0]
    )

    switch (inlineOptions.control) {
      case 'hidden':
        editorHTMLElement.classList.add('textae-editor--control-hidden')
        break
      case 'visible':
        editorHTMLElement.classList.add('textae-editor--control-visible')
        break
      default:
        // Set control bar visibility.
        if (!inlineOptions.isEditMode) {
          editorHTMLElement.classList.add('textae-editor--control-hidden')
        }
        break
    }

    annotationModel.controlBarHeight =
      controlBarHTMLElement.getBoundingClientRect().height

    initAnnotation(
      spanConfig,
      annotationModel,
      remoteResource,
      controlViewModel,
      originalData,
      inlineOptions.annotationParameter,
      inlineOptions.config,
      functionAvailability
    )

    // add context menu
    const contextMenu = new ContextMenu(
      editorHTMLElement,
      controlViewModel,
      iconEventMap
    )
    editorHTMLElement.appendChild(contextMenu.el)

    editorHTMLElement.addEventListener('keyup', (event) => {
      contextMenu.hide()

      if (presenter.isActive) {
        new KeyEventMap(
          commander,
          presenter,
          persistenceInterface,
          functionAvailability
        ).handle(event)
      }
    })

    forwardMethods(this, () => presenter, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard',
      'activate',
      'deactivate',
      'applyTextSelection',
      'focusDenotation'
    ])

    this.#contextMenu = contextMenu
  }

  showContextMenu(contextmenuEvent) {
    this.#contextMenu.show(contextmenuEvent)
  }

  hideContextMenu() {
    this.#contextMenu.hide()
  }
}
