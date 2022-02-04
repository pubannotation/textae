import alertifyjs from 'alertifyjs'
// model manages data objects.
import AnnotationData from './AnnotationData'
import SelectionModel from './SelectionModel'
// The history of command that providing undo and redo.
import History from './History'
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

    const params = extractParamsFromHTMLElement(element)

    // Set the eventEmitter to communicate with the tool and a control.
    const eventEmitter = new EventEmitter()
    observeEventEmitter(eventEmitter)

    const editorCSSClass = new EditorCSSClass(element)
    editorCSSClassObserve(eventEmitter, editorCSSClass)

    const annotationData = new AnnotationData(
      editorID,
      element,
      eventEmitter,
      editorCSSClass
    )

    // A contaier of selection state.
    const selectionModel = new SelectionModel(eventEmitter, annotationData)

    const history = new History(eventEmitter)

    // Set position of toast messages.
    alertifyjs.set('notifier', 'position', 'top-right')

    const presenter = start(
      element,
      editorID,
      eventEmitter,
      history,
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
