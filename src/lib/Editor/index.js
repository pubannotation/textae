// model manages data objects.
import AnnotationData from './AnnotationData'
import InternalAPI from './InternalAPI'
import { EventEmitter } from 'events'
import ParamsFormHTMLElement from './ParamsFromHTMLElement'
import EditorCSSClass from './EditorCSSClass'
import forwardMethods from './forwardMethods'
import observeElement from './observeElement'
import observeEventEmitter from './observeEventEmitter'
import editorCSSClassObserve from './editorCSSClassObserve'
import isAndroid from './isAndroid'
import Inspector from './Inspector'
import loadAnnotation from './loadAnnotation'
import Listener from './Listener'
import SelectionModel from './SelectionModel'

export default class Editor {
  constructor(
    element,
    editorID,
    mousePoint,
    startJQueryUIDialogWait,
    endJQueryUIDialogWait
  ) {
    // Add tabIndex to listen to keyboard events.
    element.tabIndex = -1

    if (isAndroid()) {
      element.classList.add('textae-editor--android')
    }

    observeElement(element)

    // Set the eventEmitter to communicate with the tool and a control.
    const eventEmitter = new EventEmitter()
    observeEventEmitter(eventEmitter)

    const editorCSSClass = new EditorCSSClass(element)
    editorCSSClassObserve(eventEmitter, editorCSSClass)

    const params = new ParamsFormHTMLElement(element)
    const annotationData = new AnnotationData(
      editorID,
      element,
      eventEmitter,
      editorCSSClass,
      startJQueryUIDialogWait,
      endJQueryUIDialogWait,
      params.configLock === 'true'
    )

    if (params.inspect) {
      new Inspector(
        eventEmitter,
        (annotation) => {
          const destinationElement = document.querySelector(
            `#${params.inspect}`
          )
          if (destinationElement) {
            destinationElement.textContent = JSON.stringify(annotation, null, 2)
          }
        },
        annotationData
      )
    }

    // Draws the entity when the editor's ancestor element is scrolled and
    // the entity enters the display area.
    const container = element.closest('.textae-container')
    if (container) {
      this._listener = new Listener(container, 'scroll', () => {
        annotationData.drawGridsInSight()
      })
      this._listener.bind()
    }

    // A container of selection state.
    const selectionModel = new SelectionModel(eventEmitter, annotationData)
    const internalAPI = new InternalAPI(
      element,
      editorID,
      mousePoint,
      eventEmitter,
      annotationData,
      params,
      selectionModel
    )

    forwardMethods(this, () => internalAPI, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard',
      'activate',
      'deactivate',
      'applyTextSelection',
      'showContextMenu',
      'hideContextMenu',
      'focusDenotation'
    ])
    forwardMethods(this, () => annotationData, ['drawGridsInSight', 'reLayout'])

    this._element = element
    this._annotationData = annotationData
    this._eventEmitter = eventEmitter
  }

  updateDenotationEntitiesWidth() {
    for (const span of this._annotationData.span.allDenotationSpans) {
      span.updateDenotationEntitiesWidth()
    }
  }

  load(annotation) {
    loadAnnotation(this._eventEmitter, annotation)
  }

  setInspector(callback) {
    if (this._inspector) {
      this._inspector.die()
      this._inspector = null
    }

    if (typeof callback == 'function') {
      this._inspector = new Inspector(
        this._eventEmitter,
        callback,
        this._annotationData
      )
    }
  }

  get HTMLElementID() {
    return this._element.id
  }

  dispose() {
    // There is an event listener that monitors scroll events.
    // The event listener is released when the editor is deleted.
    if (this._listener) {
      this._listener.dispose()
    }
  }
}
