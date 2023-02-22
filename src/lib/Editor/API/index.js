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
import AnnotationDataEventsObserver from '../AnnotationDataEventsObserver'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import setAnnotationAndConfiguration from './setAnnotationAndConfiguration'
import RemoteResource from '../RemoteResource'
import SelectionModel from './SelectionModel'
import forwardMethods from '../forwardMethods'
import FunctionAvailability from './FunctionAvailability'

export default class API {
  /**
   *
   * @param {import('../ParamsFromHTMLElement').default} params
   */
  constructor(
    editorHTMLElement,
    editorID,
    eventEmitter,
    annotationData,
    params
  ) {
    const spanConfig = new SpanConfig()

    // A contaier of selection state.
    const selectionModel = new SelectionModel(eventEmitter, annotationData)

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
      params.statusBar
    )

    const annotationDataEventsObserver = new AnnotationDataEventsObserver(
      eventEmitter,
      originalData,
      annotationData
    )
    const functionAvailability = new FunctionAvailability()
    const controlViewModel = new ControlViewModel(
      eventEmitter,
      selectionModel,
      clipBoard,
      annotationDataEventsObserver,
      originalData,
      annotationData.typeDefinition,
      functionAvailability
    )
    const presenter = new Presenter(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      spanConfig,
      clipBoard,
      controlViewModel,
      params.autocompletionWS,
      params.mode
    )

    const remoteResource = new RemoteResource(eventEmitter)

    const persistenceInterface = new PersistenceInterface(
      eventEmitter,
      remoteResource,
      annotationData,
      () => originalData.annotation,
      () => originalData.configuration,
      params.saveTo,
      annotationDataEventsObserver,
      controlViewModel
    )

    new AnnotationAutoSaver(
      eventEmitter,
      controlViewModel,
      persistenceInterface,
      params.saveTo,
      annotationDataEventsObserver
    )

    eventEmitter
      .on('textae-event.resource.annotation.load.success', (dataSource) => {
        if (!dataSource.data.config && params.config) {
          remoteResource.loadConfigulation(params.config, dataSource)
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
              controlViewModel,
              spanConfig,
              annotationData,
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
            controlViewModel,
            spanConfig,
            annotationData,
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
      annotationData
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

    // Set control bar visibility.
    if (params.mode === 'view') {
      editorHTMLElement.classList.add('textae-editor--control-hidden')
    }

    switch (params.control) {
      case 'hidden':
        editorHTMLElement.classList.add('textae-editor--control-hidden')
        break
      case 'visible':
        editorHTMLElement.classList.add('textae-editor--control-visible')
        break
      default:
        // No error is made if any other value is set.
        break
    }

    annotationData.controlBarHeight =
      controlBarHTMLElement.getBoundingClientRect().height

    initAnnotation(
      spanConfig,
      annotationData,
      remoteResource,
      controlViewModel,
      originalData,
      params.annotation,
      params.config,
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
      'active',
      'deactive',
      'applyTextSelection'
    ])

    this._contextMenu = contextMenu
  }

  showContextMenu(contextmenuEvent) {
    this._contextMenu.show(contextmenuEvent)
  }
  hideContextMenu() {
    this._contextMenu.hide()
  }
}
