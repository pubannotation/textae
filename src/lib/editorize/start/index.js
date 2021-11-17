import alertifyjs from 'alertifyjs'
import delegate from 'delegate'
import debounce from 'debounce'
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
import ControlBar from '../control/ControlBar'
import ContextMenu from '../control/ContextMenu'
import KeyEventMap from './KeyEventMap'
import IconEventMap from './IconEventMap'
import AnnotationDataEventsObserver from '../AnnotationDataEventsObserver'
import warningIfBeginEndOfSpanAreNotInteger from './warningIfBeginEndOfSpanAreNotInteger'
import validateConfigurationAndAlert from './validateConfigurationAndAlert'
import setAnnotationAndConfiguration from './setAnnotationAndConfiguration'
import DataSource from '../DataSource'

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
    editor.eventEmitter,
    originalData,
    annotationData
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
    annotationData,
    () => originalData.annotation,
    () => originalData.configuration,
    params.get('annotation').get('save_to'),
    annotationDataEventsObserver,
    buttonController
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

  editor.eventEmitter
    .on(
      'textae-event.data-access-object.annotation.load.success',
      (dataSource) => {
        if (!dataSource.data.config && params.get('config')) {
          dataAccessObject.loadConfigulation(params.get('config'), dataSource)
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
          }
        }
      }
    )
    .on(
      'textae-event.data-access-object.configuration.load.success',
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
      }
    )
    .on('textae-event.data-access-object.configuration.save', (editedData) => {
      originalData.configuration = new DataSource(null, null, editedData)
    })

  const dom = editor[0]

  // Prevent a selection text with shift keies.
  dom.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Prevent a selection of an entity by the double-click.
  delegate(dom, '.textae-editor__signboard', 'mousedown', (e) =>
    e.preventDefault()
  )

  document.addEventListener(
    'selectionchange',
    debounce(() => editor.instanceMethods.applyTextSelection(), 100)
  )
  document.addEventListener('contextmenu', () =>
    editor.instanceMethods.applyTextSelection()
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
