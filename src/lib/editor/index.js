import DataAccessObject from '../component/DataAccessObject'
import ButtonController from '../buttonModel/ButtonController'
import Writable from '../buttonModel/Writable'
// model manages data objects.
import AnnotationData from './Model/AnnotationData'
import Selection from './Selection'
// The history of command that providing undo and redo.
import History from './History'
import * as observe from './observe'
import start from './start'
import {
  EventEmitter as EventEmitter
}
from 'events'

const CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.'

export default function() {
  const annotationData = new AnnotationData(this)
  // A contaier of selection state.
  const selectionModel = new Selection(annotationData)
  const history = new History()
  const clipBoard = {
    // clipBoard has entity type.
    clipBoard: []
  }
  const buttonController = new ButtonController(this, annotationData, selectionModel, clipBoard)
  const dataAccessObject = new DataAccessObject(this, CONFIRM_DISCARD_CHANGE_MESSAGE)
  const writable = new Writable()

  observe.observeModelChange(annotationData, history, writable)
  observe.observeHistoryChange(
    history,
    buttonController.buttonStateHelper,
    CONFIRM_DISCARD_CHANGE_MESSAGE,
    writable
  )
  observe.observeDataSave(this, dataAccessObject, history, writable)

  // public funcitons of editor
  this.api = {
    start: (editor) => start(
      editor,
      dataAccessObject,
      history,
      buttonController,
      annotationData,
      selectionModel,
      clipBoard,
      writable
    )
  }

  // Set the eventEmitter to communicate with the tool and a control.
  this.eventEmitter = new EventEmitter()

  return this
}
