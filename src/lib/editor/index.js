const CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.'

import Observable from 'observ'
import DataAccessObject from '../component/DataAccessObject'
import ButtonController from '../buttonModel/ButtonController'
import Writable from '../buttonModel/Writable'
// model manages data objects.
import Model from './Model'
import Selection from './Selection'
// The history of command that providing undo and redo.
import History from './History'
import * as observe from './observe'
import start from './start'
import {
  EventEmitter as EventEmitter
}
from 'events'


export default function() {
  let annotationData = new Model(this).annotationData,
    // A contaier of selection state.
    selectionModel = new Selection(annotationData),
    history = new History(),
    clipBoard = {
      // clipBoard has entity type.
      clipBoard: []
    },
    buttonController = new ButtonController(this, annotationData, selectionModel, clipBoard),
    dataAccessObject = new DataAccessObject(this, CONFIRM_DISCARD_CHANGE_MESSAGE)

  let writable = new Writable()

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
