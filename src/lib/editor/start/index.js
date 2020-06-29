import alertifyjs from 'alertifyjs'
import Observable from 'observ'
import getParams from './getParams'
import SpanConfig from './SpanConfig'
import Commander from './Commander'
import TypeDefinition from '../Model/TypeDefinition'
import View from './View'
import Presenter from './Presenter'
import PersistenceInterface from './PersistenceInterface'
import APIs from './APIs'
import calculateLineHeight from './calculateLineHeight'
import focusEditorWhenFocusedChildRemoved from './focusEditorWhenFocusedChildRemoved'
import getStatusBar from './getStatusBar'
import loadAnnotation from './loadAnnotation'
import getConfigEditParamFromUrl from './getConfigEditParamFromUrl'
import OriginalData from './OriginalData'
import ButtonController from '../../ButtonController'
import ClipBoard from './ClipBoard'
import AnnotationAutoSaver from './AnnotationAutoSaver'
import observe from './observe'

export default function(
  editor,
  dataAccessObject,
  history,
  annotationData,
  selectionModel,
  annotationWatcher
) {
  const params = getParams(editor[0])
  const spanConfig = new SpanConfig()
  const typeDefinition = new TypeDefinition(editor, annotationData)

  // Users can edit model only via commands.
  const commander = new Commander(
    editor,
    annotationData,
    selectionModel,
    history,
    typeDefinition
  )
  const clipBoard = new ClipBoard(editor, commander, selectionModel)
  const buttonController = new ButtonController(
    editor,
    selectionModel,
    clipBoard
  )
  const typeGap = new Observable({
    value: -1,
    showInstance: false
  })
  const view = new View(
    editor,
    annotationData,
    selectionModel,
    typeGap,
    typeDefinition
  )
  const originalData = new OriginalData()
  const presenter = new Presenter(
    editor,
    annotationData,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    buttonController,
    typeGap,
    originalData,
    typeDefinition,
    params.get('autocompletion_ws'),
    params.get('mode')
  )

  focusEditorWhenFocusedChildRemoved(editor)

  const statusBar = getStatusBar(editor, params.get('status_bar'))

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
    typeDefinition.lockEdit()
  } else {
    typeDefinition.unlockEdit()
  }

  originalData.annotation = loadAnnotation(
    spanConfig,
    typeDefinition,
    annotationData,
    statusBar,
    params,
    dataAccessObject
  )

  const persistenceInterface = new PersistenceInterface(
    dataAccessObject,
    history,
    annotationData,
    typeDefinition,
    () => originalData.annotation,
    () => originalData.configuration,
    params.get('annotation').get('save_to')
  )

  new AnnotationAutoSaver(
    editor,
    buttonController,
    persistenceInterface,
    params.get('annotation').get('save_to'),
    annotationWatcher
  )

  const updateLineHeight = () =>
    calculateLineHeight(editor, annotationData, typeGap, view)

  editor.api = new APIs(
    commander,
    presenter,
    persistenceInterface,
    buttonController,
    view,
    updateLineHeight
  )

  observe(
    editor,
    history,
    annotationData,
    spanConfig,
    typeDefinition,
    params,
    statusBar,
    originalData
  )

  // Add tabIndex to listen to keyboard events.
  editor[0].tabIndex = -1

  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')
}
