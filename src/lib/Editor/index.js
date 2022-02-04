import alertifyjs from 'alertifyjs'
import delegate from 'delegate'
// model manages data objects.
import AnnotationData from './AnnotationData'
import SelectionModel from './SelectionModel'
// The history of command that providing undo and redo.
import History from './History'
import start from './start'
import { EventEmitter } from 'events'
import extractParamsFromHTMLElement from './extractParamsFromHTMLElement'
import ValidationDialog from '../component/ValidationDialog'
import isAndroid from './isAndroid'
import EditorCSSClass from './EditorCSSClass'
import forwardMethods from './start/forwardMethods'

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
function observeElement(element) {
  // Prevent a selection text with shift keies.
  element.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Prevent a selection of an entity by the double-click.
  delegate(element, '.textae-editor__signboard', 'mousedown', (e) =>
    e.preventDefault()
  )
}

function observeEventEmitter(eventEmitter) {
  eventEmitter
    .on('textae-event.resource.annotation.format.error', ({ displayName }) =>
      alertifyjs.error(
        `${displayName} is not a annotation file or its format is invalid.`
      )
    )
    .on('textae-event.resource.configuration.format.error', ({ displayName }) =>
      alertifyjs.error(
        `${displayName} is not a configuration file or its format is invalid.!`
      )
    )
    .on(
      'textae-event.annotation-data.all.change',
      (_, __, hasError, reject) => {
        if (hasError) {
          new ValidationDialog(reject).open()
        }
      }
    )
    .on('textae-event.annotation-data.events-observer.change', (hasChange) => {
      // change leaveMessage show
      // Reloading when trying to scroll further when you are at the top on an Android device.
      // Show a confirmation dialog to prevent this.
      window.onbeforeunload = isAndroid() || hasChange ? () => true : null
    })

  // Bind clipBoard events.
  eventEmitter.on('textae-event.clip-board.change', (added, removed) => {
    for (const entity of added) {
      entity.startCut()
    }

    for (const entity of removed) {
      entity.cancelCut()
    }
  })

  // Bind commander events.
  // When you have an entity with multiple attributes whose pred is the same,
  // if you redraw the HTML element of the entity every time you update the attributes,
  // you need to consider the mixed state of the attributes after the update and before the update.
  // Redraw all the Entities that were affected at the end of the command.
  eventEmitter.on('textae-event.commander.attributes.change', (attributes) => {
    for (const subjectModel of attributes.reduce(
      (prev, curr) => prev.add(curr.subjectModel),
      new Set()
    )) {
      subjectModel.updateElement()
    }
  })
}

function editorCSSClassObserve(eventEmitter, editorCSSClass) {
  eventEmitter
    .on('textae-event.resource.startLoad', () => editorCSSClass.startWait())
    .on('textae-event.resource.endLoad', () => editorCSSClass.endWait())
    .on('textae-event.resource.startSave', () => editorCSSClass.startWait())
    .on('textae-event.resource.endSave', () => editorCSSClass.endWait())
}
