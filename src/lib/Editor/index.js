// model manages data objects.
import AnnotationData from './AnnotationData'
import API from './API'
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

export default class Editor {
  constructor(
    element,
    editorID,
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
      endJQueryUIDialogWait
    )
    if (params.configLock === 'true') {
      annotationData.typeDefinition.lockEdit()
    } else {
      annotationData.typeDefinition.unlockEdit()
    }

    if (params.inspect) {
      new Inspector(eventEmitter, (annotation) => {
        const destinationElement = document.querySelector(`#${params.inspect}`)
        if (destinationElement) {
          destinationElement.textContent = JSON.stringify(annotation, null, 2)
        }
      })
    }

    const api = new API(element, editorID, eventEmitter, annotationData, params)

    forwardMethods(this, () => api, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard',
      'activate',
      'deactivate',
      'applyTextSelection',
      'showContextMenu',
      'hideContextMenu'
    ])
    forwardMethods(this, () => annotationData, ['drawGridsInSight', 'reLayout'])

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
      this._inspector = new Inspector(this._eventEmitter, callback)
    }
  }
}
