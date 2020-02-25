import alertifyjs from 'alertifyjs'
import Observable from 'observ'
import getParams from './getParams'
import SpanConfig from './SpanConfig'
import Commander from './Commander'
import TypeDefinition from '../Model/TypeDefinition'
import View from './View'
import Presenter from './Presenter'
import bindMouseEvent from './bindMouseEvent'
import PersistenceInterface from './PersistenceInterface'
import APIs from './APIs'
import calculateLineHeight from './calculateLineHeight'
import focusEditorWhenFocusedChildRemoved from './focusEditorWhenFocusedChildRemoved'
import validateConfiguration from '../Model/AnnotationData/validateConfiguration'
import getStatusBar from './getStatusBar'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'
import setAnnotation from './setAnnotation'
import loadAnnotation from './loadAnnotation'
import getConfigEditParamFromUrl from './getConfigEditParamFromUrl'
import OriginalData from './OriginalData'
import hasUndefinedAttributes from './hasUndefinedAttributes'

export default function(
  editor,
  dataAccessObject,
  history,
  buttonController,
  annotationData,
  selectionModel,
  clipBoard
) {
  const params = getParams(editor[0])
  const spanConfig = new SpanConfig()

  editor.eventEmitter.on('textae.typeDefinition.reset', () =>
    history.resetConfiguration()
  )

  const typeDefinition = new TypeDefinition(editor, annotationData)

  // Users can edit model only via commands.
  const commander = new Commander(
    editor,
    annotationData,
    selectionModel,
    history,
    typeDefinition
  )

  const typeGap = new Observable({
    value: -1,
    showInstance: false
  })
  const view = new View(
    editor,
    annotationData,
    selectionModel,
    buttonController.buttonStateHelper,
    typeGap,
    typeDefinition
  )

  const originalData = new OriginalData()

  editor.eventEmitter
    .on('textae.dataAccessObject.annotation.load', ({ annotation, source }) => {
      if (!annotation || !annotation.text) {
        alertifyjs.error(
          `${source} is not a annotation file or its format is invalid.`
        )
        return
      }

      setAnnotation(
        spanConfig,
        typeDefinition,
        annotationData,
        annotation,
        params.get('config')
      )
      statusBar.status(source)
      originalData.annotation = annotation
      editor.eventEmitter.emit('textae.pallet.update')
    })
    .on('textae.dataAccessObject.configuration.load', ({ config, source }) => {
      if (!validateConfiguration(config)) {
        alertifyjs.error(
          `${source} is not a configuration file or its format is invalid.`
        )
        return
      }

      const error = hasUndefinedAttributes(annotationData.toJson(), config)
      if (error) {
        alertifyjs.error(error)
        return
      }

      originalData.configuration = config
      setSpanAndTypeConfig(spanConfig, typeDefinition, config)
    })
    .on('textae.dataAccessObject.configuration.save', () => {
      originalData.configuration = Object.assign(
        originalData.configuration,
        typeDefinition.config
      )
    })

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

  bindMouseEvent(editor, view)
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

  // Bind keyup event
  editor[0].addEventListener('keyup', (event) => {
    editor.eventEmitter.emit('textae.editor.key.input')
    editor.api.handleKeyInput(event)
  })

  // Add tabIndex to listen to keyboard events.
  editor[0].tabIndex = -1

  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')
}
