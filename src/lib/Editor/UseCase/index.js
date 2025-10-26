import alertifyjs from 'alertifyjs'

import { MODE } from '../../MODE'
import AnnotationModelEventsObserver from '../AnnotationModelEventsObserver'
import ContextMenu from '../control/ContextMenu'
import ToolBar from '../control/ToolBar'
import forwardMethods from '../forwardMethods'
import RemoteResource from '../RemoteResource'
import AnnotationAutoSaver from './AnnotationAutoSaver'
import bindLoadEvents from './bindLoadEvents'
import Clipboard from './Clipboard'
import Commander from './Commander'
import CurrentEditMode from './CurrentEditMode'
import EditModeFactory from './EditModeFactory'
import EditModeState from './EditModeState'
import EditModeSwitch from './EditModeSwitch'
import ModeTransitionReactor from './EditModeSwitch/ModeTransitionReactor'
import FunctionAvailability from './FunctionAvailability'
import IconEventMap from './IconEventMap'
import initAnnotation from './initAnnotation'
import KeyEventMap from './KeyEventMap'
import MenuState from './MenuState'
import OriginalData from './OriginalData'
import PersistenceInterface from './PersistenceInterface'
import Presenter from './Presenter'
import SpanConfig from './SpanConfig'

export default class UseCase {
  #contextMenu
  #annotationModel
  #editModeState
  #viewMode
  #editModeSwitch

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
    this.#annotationModel = annotationModel

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
    this.#editModeState = editModeState
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
      spanConfig,
      commander,
      menuState,
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
      annotationModel,
      spanConfig,
      menuState
    )
    this.#viewMode = viewMode
    const currentEditMode = new CurrentEditMode(
      editModeState,
      termEditMode,
      blockEditMode,
      relationEditMode,
      textEditMode,
      viewMode,
      eventEmitter
    )

    const editModeSwitch = new EditModeSwitch(
      startUpOptions,
      editModeState,
      annotationModel.relationInstanceContainer,
      () => currentEditMode.hidePallet()
    )
    eventEmitter.on(
      'textae-event.annotation-data.all.change',
      (hasMultiTracks) => {
        if (startUpOptions.isEditMode && hasMultiTracks) {
          alertifyjs.success(
            'track annotations have been merged to root annotations.'
          )
        }

        editModeSwitch.reset()
      }
    )
    this.#editModeSwitch = editModeSwitch

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
      currentEditMode
    )

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

    new ModeTransitionReactor(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      termEditMode,
      blockEditMode,
      relationEditMode,
      textEditMode
    )

    bindLoadEvents(
      eventEmitter,
      startUpOptions,
      remoteResource,
      menuState,
      spanConfig,
      annotationModel,
      functionAvailability,
      originalData
    )

    const iconEventMap = new IconEventMap(
      commander,
      presenter,
      persistenceInterface,
      menuState,
      annotationModel,
      currentEditMode,
      editModeSwitch
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
          functionAvailability,
          currentEditMode,
          editModeSwitch
        ).handle(event)
      }
    })

    forwardMethods(this, () => presenter, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard',
      'activate',
      'deactivate',
      'applyTextSelectionWithTouchDevice'
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
    this.#editModeSwitch.toTermEditMode()
    this.#annotationModel.focusDenotation(denotationID)
  }

  getSelectedText() {
    if (this.#editModeState.currentState === MODE.VIEW) {
      return this.#viewMode.selectedText
    } else {
      return {
        status: 'unselected'
      }
    }
  }
}
