import alertifyjs from 'alertifyjs'
import SpanConfig from './SpanConfig'
import Commander from './Commander'
import Presenter from './Presenter'
import PersistenceInterface from './PersistenceInterface'
import initAnnotation from './initAnnotation'
import OriginalData from './OriginalData'
import MenuState from './MenuState'
import Clipboard from './Clipboard'
import AnnotationAutoSaver from './AnnotationAutoSaver'
import ToolBar from '../control/ToolBar'
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
import EditModeState from './EditModeState'
import EditModeSwitch from './EditModeSwitch'
import EditModeFactory from './EditModeFactory'
import { MODE } from '../../MODE'

class EditMode {
  #editModeState
  #termEditMode
  #blockEditMode
  #relationEditMode
  #textEditMode
  #viewMode

  constructor(
    editModeState,
    termEditMode,
    blockEditMode,
    relationEditMode,
    textEditMode,
    viewMode
  ) {
    this.#editModeState = editModeState
    this.#termEditMode = termEditMode
    this.#blockEditMode = blockEditMode
    this.#relationEditMode = relationEditMode
    this.#textEditMode = textEditMode
    this.#viewMode = viewMode
  }

  get current() {
    switch (this.#editModeState.currentState) {
      case MODE.EDIT_DENOTATION:
        return this.#termEditMode
      case MODE.EDIT_BLOCK:
        return this.#blockEditMode
      case MODE.EDIT_RELATION:
        return this.#relationEditMode
      case MODE.EDIT_TEXT:
        return this.#textEditMode
      default:
        return this.#viewMode
    }
  }
}
export default class UseCase {
  #contextMenu
  #presenter
  #annotationModel

  /**
   *
   * @param {import('../StartUpOptions').StartUpOptions} startUpOptions
   */
  constructor(
    editorHTMLElement,
    editorID,
    mousePoint,
    eventEmitter,
    annotationModel,
    startUpOptions,
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
      annotationModel.typeDictionary
    )
    const originalData = new OriginalData(
      eventEmitter,
      editorHTMLElement,
      startUpOptions.statusBar
    )

    const annotationModelEventsObserver = new AnnotationModelEventsObserver(
      eventEmitter,
      originalData,
      annotationModel
    )
    const functionAvailability = new FunctionAvailability()
    const editModeState = new EditModeState(
      annotationModel.relationInstanceContainer,
      eventEmitter,
      functionAvailability
    )
    const menuState = new MenuState(
      eventEmitter,
      selectionModel,
      clipBoard,
      annotationModelEventsObserver,
      originalData,
      annotationModel.typeDictionary,
      functionAvailability,
      editModeState
    )
    const termEditMode = EditModeFactory.createTermEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      spanConfig,
      mousePoint
    )
    const blockEditMode = EditModeFactory.createBlockEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      menuState,
      mousePoint
    )
    const relationEditMode = EditModeFactory.createRelationEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      mousePoint
    )
    const textEditMode = EditModeFactory.createTextEditMode(
      editorHTMLElement,
      annotationModel,
      spanConfig,
      menuState,
      commander
    )
    const viewMode = EditModeFactory.createViewMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel
    )
    const editMode = new EditMode(
      editModeState,
      termEditMode,
      blockEditMode,
      relationEditMode,
      textEditMode,
      viewMode
    )
    const editModeSwitch = new EditModeSwitch(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      startUpOptions,
      editModeState,
      termEditMode,
      blockEditMode,
      relationEditMode,
      textEditMode,
      viewMode
    )
    const presenter = new Presenter(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      spanConfig,
      functionAvailability,
      clipBoard,
      menuState,
      startUpOptions,
      editModeSwitch
    )
    this.#presenter = presenter
    this.#annotationModel = annotationModel

    const remoteResource = new RemoteResource(eventEmitter)

    const persistenceInterface = new PersistenceInterface(
      eventEmitter,
      remoteResource,
      annotationModel,
      () => originalData.annotation,
      () => originalData.configuration,
      startUpOptions.saveTo,
      annotationModelEventsObserver,
      menuState
    )

    new AnnotationAutoSaver(
      eventEmitter,
      menuState,
      persistenceInterface,
      startUpOptions.saveTo,
      annotationModelEventsObserver
    )

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

    const iconEventMap = new IconEventMap(
      commander,
      presenter,
      persistenceInterface,
      menuState,
      annotationModel,
      editMode
    )

    // Add the tool bar
    const toolBarHTMLElement = new ToolBar(
      eventEmitter,
      menuState,
      iconEventMap
    ).el
    editorHTMLElement.insertBefore(
      toolBarHTMLElement,
      editorHTMLElement.childNodes[0]
    )

    switch (startUpOptions.control) {
      case 'hidden':
        editorHTMLElement.classList.add('textae-editor--control-hidden')
        break
      case 'visible':
        editorHTMLElement.classList.add('textae-editor--control-visible')
        break
      default:
        // Set control bar visibility.
        if (!startUpOptions.isEditMode) {
          editorHTMLElement.classList.add('textae-editor--control-hidden')
        }
        break
    }

    annotationModel.toolBarHeight =
      toolBarHTMLElement.getBoundingClientRect().height

    initAnnotation(
      spanConfig,
      annotationModel,
      remoteResource,
      menuState,
      originalData,
      startUpOptions,
      functionAvailability
    )

    // add context menu
    const contextMenu = new ContextMenu(
      editorHTMLElement,
      menuState,
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
      'applyTextSelectionWithTouchDevice',
      'getSelectedText'
    ])

    this.#contextMenu = contextMenu
  }

  showContextMenu(contextmenuEvent) {
    this.#contextMenu.show(contextmenuEvent)
  }

  hideContextMenu() {
    this.#contextMenu.hide()
  }

  focusDenotation(denotationID) {
    this.#presenter.toTermEditMode()
    this.#annotationModel.focusDenotation(denotationID)
  }
}
