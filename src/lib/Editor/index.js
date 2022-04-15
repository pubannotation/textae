// model manages data objects.
import AnnotationData from './AnnotationData'
import API from './API'
import { EventEmitter } from 'events'
import extractParamsFromHTMLElement from './extractParamsFromHTMLElement'
import EditorCSSClass from './EditorCSSClass'
import forwardMethods from './forwardMethods'
import observeElement from './observeElement'
import observeEventEmitter from './observeEventEmitter'
import editorCSSClassObserve from './editorCSSClassObserve'
import isAndroid from './isAndroid'

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

    const params = extractParamsFromHTMLElement(element)
    const annotationData = new AnnotationData(
      editorID,
      element,
      eventEmitter,
      editorCSSClass,
      startJQueryUIDialogWait,
      endJQueryUIDialogWait
    )
    if (params.has('config_lock') && params.get('config_lock') === 'true') {
      annotationData.typeDefinition.lockEdit()
    } else {
      annotationData.typeDefinition.unlockEdit()
    }

    const api = new API(element, editorID, eventEmitter, annotationData, params)

    forwardMethods(this, () => api, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard',
      'active',
      'deactive',
      'applyTextSelection',
      'showContextMenu',
      'hideContextMenu'
    ])
    forwardMethods(this, () => annotationData, ['drawGridsInSight', 'relayout'])

    this._annotationData = annotationData
  }

  updateDenotationEntitiesWidth() {
    for (const span of this._annotationData.span.allDenotationSpans) {
      span.updateDenotationEntitiesWidth()
    }
  }
}
