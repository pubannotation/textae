// model manages data objects.
import AnnotationData from './AnnotationData'
import SelectionModel from './SelectionModel'
import start from './start'
import { EventEmitter } from 'events'
import extractParamsFromHTMLElement from './extractParamsFromHTMLElement'
import EditorCSSClass from './EditorCSSClass'
import forwardMethods from './start/forwardMethods'
import observeElement from './observeElement'
import observeEventEmitter from './observeEventEmitter'
import editorCSSClassObserve from './editorCSSClassObserve'

export default class EditorAPI {
  constructor(element, editorID) {
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
      editorCSSClass
    )

    // A contaier of selection state.
    const selectionModel = new SelectionModel(eventEmitter, annotationData)

    const presenter = start(
      element,
      editorID,
      eventEmitter,
      annotationData,
      selectionModel,
      params
    )

    forwardMethods(this, () => presenter, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard',
      'isActive',
      'active',
      'deactive',
      'applyTextSelection'
    ])

    this._annotationData = annotationData
  }

  drawGridsInSight() {
    this._annotationData.drawGridsInSight()
  }

  relayout() {
    this._annotationData.textBox.forceUpdate()
    this._annotationData.updatePosition()
  }
}
