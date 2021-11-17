import $ from 'jquery'
import DataAccessObject from './DataAccessObject'
// model manages data objects.
import AnnotationData from './AnnotationData'
import SelectionModel from './SelectionModel'
// The history of command that providing undo and redo.
import History from './History'
import start from './start'
import { EventEmitter } from 'events'
import observeDataSave from './observeDataSave'
import getParams from './getParams'
import ValidationDialog from '../component/ValidationDialog'

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

  observeDataSave($this, history)
  $this.eventEmitter.on(
    'textae-event.annotation-data.all.change',
    (_, __, hasError, reject) => {
      if (hasError) {
        new ValidationDialog(reject).open()
      }
    }
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
