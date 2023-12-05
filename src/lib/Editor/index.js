// model manages data objects.
import AnnotationModel from './AnnotationModel'
import UseCase from './UseCase'
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
  #element
  #annotationModel
  #eventEmitter
  #inspector
  #scrollEventListeners

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
    const annotationModel = new AnnotationModel(
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
        annotationModel
      )
    }
    this.#scrollEventListeners = this.#observeScrollEvent(
      annotationModel,
      element
    )

    // A container of selection state.
    const selectionModel = new SelectionModel(eventEmitter, annotationModel)
    const useCase = new UseCase(
      element,
      editorID,
      mousePoint,
      eventEmitter,
      annotationModel,
      params,
      selectionModel
    )

    forwardMethods(this, () => useCase, [
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
    forwardMethods(this, () => selectionModel, ['selectDenotation'])
    forwardMethods(this, () => annotationModel, [
      'drawGridsInSight',
      'reLayout'
    ])

    this.#element = element
    this.#annotationModel = annotationModel
    this.#eventEmitter = eventEmitter
  }

  updateDenotationEntitiesWidth() {
    for (const span of this.#annotationModel.span.allDenotationSpans) {
      span.updateDenotationEntitiesWidth()
    }
  }

  load(annotation) {
    loadAnnotation(this.#eventEmitter, annotation)
  }

  setInspector(callback) {
    if (this.#inspector) {
      this.#inspector.die()
      this.#inspector = null
    }

    if (typeof callback == 'function') {
      this.#inspector = new Inspector(
        this.#eventEmitter,
        callback,
        this.#annotationModel
      )
    }
  }

  get HTMLElementID() {
    return this.#element.id
  }

  dispose() {
    // There is an event listener that monitors scroll events.
    // The event listener is released when the editor is deleted.
    for (const listener of this.#scrollEventListeners) {
      listener.dispose()
    }
  }

  #observeScrollEvent(annotationModel, element) {
    const scrollEventListeners = new Set()

    // Draws the entity when the editor is scrolled and the entity enters the display area.
    const showHideElements = () => annotationModel.drawGridsInSight()
    const listener = new Listener(element, 'scroll', showHideElements)
    listener.bind()
    scrollEventListeners.add(listener)

    // Draws the entity when the editor's ancestor element is scrolled and
    // the entity enters the display area.
    const container = element.closest('.textae-container')
    if (container) {
      const listener = new Listener(container, 'scroll', showHideElements)
      listener.bind()
      scrollEventListeners.add(listener)
    }

    return scrollEventListeners
  }
}
