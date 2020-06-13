import DataAccessObject from '../component/DataAccessObject'
// model manages data objects.
import AnnotationData from './Model/AnnotationData'
import Selection from './Selection'
// The history of command that providing undo and redo.
import History from './History'
import bindUpdateSaveButton from './bindUpdateSaveButton'
import start from './start'
import { EventEmitter } from 'events'
import CONFIRM_DISCARD_CHANGE_MESSAGE from './CONFIRM_DISCARD_CHANGE_MESSAGE'
import observeDataSave from './observeDataSave'
import observeModelChange from './observeModelChange'

export default function() {
  // Set the eventEmitter to communicate with the tool and a control.
  this.eventEmitter = new EventEmitter()

  const annotationData = new AnnotationData(this)

  // A contaier of selection state.
  const selectionModel = new Selection(this.eventEmitter, annotationData)

  const history = new History(this.eventEmitter)
  const clipBoard = {
    // clipBoard has entity type.
    clipBoard: []
  }
  const dataAccessObject = new DataAccessObject(
    this,
    CONFIRM_DISCARD_CHANGE_MESSAGE
  )

  bindUpdateSaveButton(this)
  observeDataSave(this, history)
  observeModelChange(this, history)

  // public funcitons of editor
  this.api = {
    start: (editor) =>
      start(
        editor,
        dataAccessObject,
        history,
        annotationData,
        selectionModel,
        clipBoard
      )
  }

  return this
}
