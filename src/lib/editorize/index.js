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

export default function ($this) {
  const element = $this[0]
  const params = extractParamsFromHTMLElement(element)

  // Set the eventEmitter to communicate with the tool and a control.
  const eventEmitter = new EventEmitter()
  const editorCSSClass = new EditorCSSClass(element)
  const annotationData = new AnnotationData($this, eventEmitter, editorCSSClass)

  // A contaier of selection state.
  const selectionModel = new SelectionModel(eventEmitter, annotationData)

  const history = new History(eventEmitter)

  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

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

  // public funcitons of editor
  Object.assign($this, {
    start(editor) {
      start(editor, history, annotationData, selectionModel, params)
    },
    eventEmitter
  })

  eventEmitter
    .on('textae-event.resource.startLoad', () => editorCSSClass.startWait())
    .on('textae-event.resource.endLoad', () => editorCSSClass.endWait())
    .on('textae-event.resource.startSave', () => editorCSSClass.startWait())
    .on('textae-event.resource.endSave', () => editorCSSClass.endWait())

  return $this
}
