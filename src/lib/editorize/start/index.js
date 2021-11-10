import alertifyjs from 'alertifyjs'
import SpanConfig from './SpanConfig'
import Commander from './Commander'
import View from './View'
import Presenter from './Presenter'
import PersistenceInterface from './PersistenceInterface'
import InstanceMethods from './InstanceMethods'
import focusEditorWhenFocusedChildRemoved from './focusEditorWhenFocusedChildRemoved'
import getStatusBar from './getStatusBar'
import initAnnotation from './initAnnotation'
import getConfigEditParamFromUrl from './getConfigEditParamFromUrl'
import OriginalData from './OriginalData'
import ButtonController from './ButtonController'
import ClipBoard from './ClipBoard'
import AnnotationAutoSaver from './AnnotationAutoSaver'
import observe from './observe'
import ControlBar from '../control/ControlBar'
import ContextMenu from '../control/ContextMenu'
import KeyEventMap from './KeyEventMap'
import IconEventMap from './IconEventMap'
import AnnotationDataEventsObserver from '../AnnotationDataEventsObserver'

export default function (
  editor,
  dataAccessObject,
  history,
  annotationData,
  selectionModel,
  params
) {
  const spanConfig = new SpanConfig()

  // Users can edit model only via commands.
  const commander = new Commander(
    editor,
    annotationData,
    selectionModel,
    history
  )
  const clipBoard = new ClipBoard(
    editor.eventEmitter,
    commander,
    selectionModel
  )
  const view = new View(editor.eventEmitter, annotationData)
  const statusBar = getStatusBar(editor, params.get('status_bar'))
  const originalData = new OriginalData(editor, dataAccessObject, statusBar)
  const annotationDataEventsObserver = new AnnotationDataEventsObserver(
    editor.eventEmitter
  )
  const buttonController = new ButtonController(
    editor.eventEmitter,
    selectionModel,
    clipBoard,
    annotationDataEventsObserver,
    originalData,
    annotationData.typeDefinition
  )
  const presenter = new Presenter(
    editor,
    annotationData,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    buttonController,
    view,
    params.get('autocompletion_ws'),
    params.get('mode')
  )

  focusEditorWhenFocusedChildRemoved(editor)

  if (params.get('control') === 'visible') {
    editor[0].classList.add('textae-editor--control-visible')
  }

  if (params.get('control') === 'hidden') {
    editor[0].classList.add('textae-editor--control-hidden')
  }

  // Over write editor-div's config lock state by url's.
  // Url's default is 'unlock', so its default is also 'unlock'.
  const configEditFromUrl = getConfigEditParamFromUrl(params.get('source'))
  if (configEditFromUrl !== null) {
    params.set('config_lock', configEditFromUrl)
  }

  if (params.has('config_lock') && params.get('config_lock') === 'true') {
    annotationData.typeDefinition.lockEdit()
  } else {
    annotationData.typeDefinition.unlockEdit()
  }

  initAnnotation(
    spanConfig,
    annotationData,
    statusBar,
    params,
    dataAccessObject,
    buttonController,
    originalData
  )

  const persistenceInterface = new PersistenceInterface(
    editor,
    dataAccessObject,
    history,
    annotationData,
    () => originalData.annotation,
    () => originalData.configuration,
    params.get('annotation').get('save_to')
  )

  new AnnotationAutoSaver(
    editor.eventEmitter,
    buttonController,
    persistenceInterface,
    params.get('annotation').get('save_to'),
    annotationDataEventsObserver
  )

  editor.instanceMethods = new InstanceMethods(
    presenter,
    buttonController,
    view
  )

  observe(
    editor,
    history,
    annotationData,
    spanConfig,
    params,
    originalData,
    dataAccessObject,
    buttonController
  )

  editor.eventEmitter
    .on('textae-event.pallet.read-button.click', () =>
      persistenceInterface.importConfiguration()
    )
    .on('textae-event.pallet.write-button.click', () =>
      persistenceInterface.uploadConfiguration()
    )

  // Add tabIndex to listen to keyboard events.
  editor[0].tabIndex = -1

  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

  const iconEventMap = new IconEventMap(
    commander,
    presenter,
    persistenceInterface,
    view,
    buttonController
  )

  // add control bar
  editor[0].insertBefore(
    new ControlBar(editor, buttonController, iconEventMap).el,
    editor[0].childNodes[0]
  )
  // add context menu
  const contextMenu = new ContextMenu(editor, buttonController, iconEventMap)
  editor[0].appendChild(contextMenu.el)

  const keyEventMap = new KeyEventMap(
    commander,
    presenter,
    persistenceInterface
  )
  editor[0].addEventListener('keyup', (event) => {
    contextMenu.hide()
    keyEventMap.handle(editor.instanceMethods.isActive, event)
  })
}
