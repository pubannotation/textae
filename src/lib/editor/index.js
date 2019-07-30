import DataAccessObject from '../component/DataAccessObject'
import ButtonController from '../buttonModel/ButtonController'
// model manages data objects.
import AnnotationData from './Model/AnnotationData'
import Selection from './Selection'
// The history of command that providing undo and redo.
import History from './History'
import bindUpdateSaveButton from './bindUpdateSaveButton'
import * as observe from './observe'
import start from './start'
import { EventEmitter } from 'events'
import CONFIRM_DISCARD_CHANGE_MESSAGE from './CONFIRM_DISCARD_CHANGE_MESSAGE'

export default function() {
  const annotationData = new AnnotationData(this)
  // A contaier of selection state.
  const selectionModel = new Selection(annotationData)
  const history = new History()
  const clipBoard = {
    // clipBoard has entity type.
    clipBoard: []
  }
  const buttonController = new ButtonController(
    this,
    annotationData,
    selectionModel,
    clipBoard
  )
  const dataAccessObject = new DataAccessObject(
    this,
    CONFIRM_DISCARD_CHANGE_MESSAGE
  )

  bindUpdateSaveButton(
    history,
    dataAccessObject,
    annotationData,
    buttonController
  )
  observe.observeModelChange(annotationData, history)
  observe.observeHistoryChange(
    history,
    buttonController.buttonStateHelper,
    CONFIRM_DISCARD_CHANGE_MESSAGE
  )
  observe.observeDataSave(this, dataAccessObject, history)

  // public funcitons of editor
  this.api = {
    start: (editor) =>
      start(
        editor,
        dataAccessObject,
        history,
        buttonController,
        annotationData,
        selectionModel,
        clipBoard
      )
  }

  // Set the eventEmitter to communicate with the tool and a control.
  this.eventEmitter = new EventEmitter()

  return this
}
