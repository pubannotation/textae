import $ from 'jquery'
import alertifyjs from 'alertifyjs'
import delegate from 'delegate'
import DataAccessObject from './DataAccessObject'
// model manages data objects.
import AnnotationData from './AnnotationData'
import SelectionModel from './SelectionModel'
// The history of command that providing undo and redo.
import History from './History'
import start from './start'
import { EventEmitter } from 'events'
import getParams from './getParams'
import ValidationDialog from '../component/ValidationDialog'

function isAndroid() {
  // For development environments, Use the navigator.userAgent.
  // Because the navigator.userAgentData only work in the secure context(HTTPS).
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
  return /Android/.test(navigator.userAgent)
}

export default function (element) {
  const $this = $(element)

  // Set the eventEmitter to communicate with the tool and a control.
  $this.eventEmitter = new EventEmitter()

  const params = getParams($this[0])
  const annotationData = new AnnotationData($this)

  // A contaier of selection state.
  const selectionModel = new SelectionModel($this.eventEmitter, annotationData)

  const history = new History($this.eventEmitter)
  const dataAccessObject = new DataAccessObject($this)

  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

  $this.eventEmitter
    .on('textae-event.data-access-object.annotation.save', () => {
      alertifyjs.success('annotation saved')
    })
    .on('textae-event.data-access-object.configuration.save', () => {
      alertifyjs.success('configuration saved')
    })
    .on('textae-event.data-access-object.save.error', () => {
      alertifyjs.error('could not save')
    })
    .on('textae-event.data-access-object.annotation.load.error', (url) =>
      alertifyjs.error(
        `Could not load the file from the location you specified.: ${url}`
      )
    )
    .on(
      'textae-event.data-access-object.annotation.format.error',
      ({ displayName }) =>
        alertifyjs.error(
          `${displayName} is not a annotation file or its format is invalid.`
        )
    )
    .on('textae-event.data-access-object.configuration.load.error', (url) =>
      alertifyjs.error(
        `Could not load the file from the location you specified.: ${url}`
      )
    )
    .on(
      'textae-event.data-access-object.configuration.format.error',
      ({ displayName }) =>
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

  const dom = $this[0]

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

  // public funcitons of editor
  Object.assign($this, {
    start(editor) {
      start(
        editor,
        dataAccessObject,
        history,
        annotationData,
        selectionModel,
        params
      )
    },
    startWait() {
      $this[0].classList.add('textae-editor--wait')
    },
    endWait() {
      $this[0].classList.remove('textae-editor--wait')
    }
  })

  return $this
}
