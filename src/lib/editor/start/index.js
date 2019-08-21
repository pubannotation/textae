import Observable from 'observ'
import getParams from './getParams'
import SpanConfig from './SpanConfig'
import Command from './Command'
import TypeDefinition from '../Model/TypeDefinition'
import View from './View'
import Presenter from './Presenter'
import bindMouseEvent from './bindMouseEvent'
import PersistenceInterface from './PersistenceInterface'
import APIs from './APIs'
import calculateLineHeight from './calculateLineHeight'
import focusEditorWhenFocusedChildRemoved from './focusEditorWhenFocusedChildRemoved'
import validateConfiguration from '../Model/AnnotationData/validateConfiguration'
import toastr from 'toastr'
import getStatusBar from './getStatusBar'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'
import setAnnotation from './setAnnotation'
import loadAnnotation from './loadAnnotation'
import getConfigEditParamFromUrl from './getConfigEditParamFromUrl'
import OriginalData from './OriginalData'

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
  // Users can edit model only via commands.
  const command = new Command(editor, annotationData, selectionModel, history)
  const typeGap = new Observable({
    value: -1,
    showInstance: false
  })
  const typeDefinition = new TypeDefinition(annotationData)
  typeDefinition.entity.on('type.reset', () => history.resetConfiguration())
  typeDefinition.relation.on('type.reset', () => history.resetConfiguration())

  const view = new View(
    editor,
    annotationData,
    selectionModel,
    buttonController.buttonStateHelper,
    typeGap,
    typeDefinition
  )
  const presenter = new Presenter(
    editor,
    history,
    annotationData,
    selectionModel,
    command,
    spanConfig,
    clipBoard,
    buttonController,
    typeGap,
    typeDefinition,
    params.get('autocompletion_ws'),
    params.get('mode')
  )

  bindMouseEvent(editor, presenter, view)
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

  const originalData = new OriginalData()

  dataAccessObject
    .on('annotation.load', ({ annotation, source }) => {
      if (!annotation || !annotation.text) {
        toastr.error(
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
    .on('configuration.load', ({ config, source }) => {
      if (!validateConfiguration(config)) {
        toastr.error(
          `${source} is not a configuration file or its format is invalid.`
        )
        return
      }
      originalData.config = config
      setSpanAndTypeConfig(spanConfig, typeDefinition, config)
    })
    .on('configuration.save', () => {
      originalData.config = typeDefinition.getConfig()
    })

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
    () => originalData.config,
    params.get('annotation').get('save_to')
  )
  const updateLineHeight = () =>
    calculateLineHeight(editor, annotationData, typeDefinition, typeGap, view)

  editor.api = new APIs(
    command,
    presenter,
    persistenceInterface,
    buttonController,
    view,
    updateLineHeight
  )

  // Add tabIndex to listen to keyboard events.
  editor[0].tabIndex = -1
}
