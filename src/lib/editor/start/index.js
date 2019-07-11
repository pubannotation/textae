import Observable from 'observ'
import cookieHandler from '../../util/CookieHandler'
import getParams from './getParams'
import SpanConfig from './SpanConfig'
import Command from './Command'
import TypeDefinition from '../Model/TypeDefinition'
import View from './View'
import Presenter from './Presenter'
import bindMouseEvent from './bindMouseEvent'
import DaoHandler from './DaoHandler'
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

export default function(editor, dataAccessObject, history, buttonController, annotationData, selectionModel, clipBoard, writable) {
  const params = getParams(editor[0])
  const spanConfig = new SpanConfig()
  // Users can edit model only via commands.
  const command = new Command(editor, annotationData, selectionModel, history)
  const typeGap = new Observable({
    value: -1,
    showInstance: false
  })
  const typeDefinition = new TypeDefinition(annotationData)
  const view = new View(editor, annotationData, selectionModel, buttonController, typeGap, typeDefinition)
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
    writable,
    params.get('autocompletion_ws'),
    params.get('mode')
  )

  bindMouseEvent(editor, presenter, view)
  focusEditorWhenFocusedChildRemoved(editor)

  // Manage the original annotation
  let originalAnnotation

  const daoHandler = new DaoHandler(
      dataAccessObject,
      history,
      annotationData,
      typeDefinition,
      () => originalAnnotation,
      params.get('annotation')
    )
  const statusBar = getStatusBar(editor, params.get('status_bar'))

  if (params.get('control') === 'visible') {
    editor[0].classList.add('textae-editor--control-visible')
  }

  if (params.get('control') === 'hidden') {
    editor[0].classList.add('textae-editor--control-hidden')
  }

  editor.eventEmitter.on('textae.message-box.hide', () => {
    cookieHandler().set('hide-message-box', 'true', {path: '/'})
  })

  editor.eventEmitter.on('textae.message-box.show', () => {
    cookieHandler().set('hide-message-box', 'false', {path: '/'})
  })

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

  dataAccessObject
    .on('load--annotation', data => {
      setAnnotation(spanConfig, typeDefinition, annotationData, data.annotation, params.get('config'))
      statusBar.status(data.source)
      originalAnnotation = data.annotation
      editor.eventEmitter.emit('textae.pallet.update')
    })
    .on('load--config', data => {
      if (!validateConfiguration(data.config)) {
        toastr.error('This is not a configuration file or its format is invalid.')
        return
      }
      originalAnnotation.config = data.config
      data.annotation = Object.assign(originalAnnotation, annotationData.toJson())
      setSpanAndTypeConfig(spanConfig, typeDefinition, data.config)
      annotationData.resetOnlyConfig(data.annotation)
    })
    .on('save--config', function() {
      originalAnnotation.config = typeDefinition.getConfig()
    })

  originalAnnotation = loadAnnotation(spanConfig, typeDefinition, annotationData, statusBar, params, dataAccessObject)

  const updateLineHeight = () => calculateLineHeight(editor, annotationData, typeDefinition, typeGap, view)

  editor.api = new APIs(
    command,
    presenter,
    daoHandler,
    buttonController,
    view,
    updateLineHeight
  )

  // Add tabIndex to listen to keyboard events.
  editor[0].tabIndex = -1
}
