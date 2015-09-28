const CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.'

import Observable from 'observ'
import DataAccessObject from '../component/DataAccessObject'
import ButtonController from '../buttonModel/ButtonController'
import Writable from '../buttonModel/Writable'
// model manages data objects.
import Model from './Model'
// The history of command that providing undo and redo.
import History from './History'
import * as observe from './observe'
import start from './start'

export default function() {
  let model = new Model(this),
    history = new History(),
    clipBoard = {
      // clipBoard has entity type.
      clipBoard: []
    },
    buttonController = new ButtonController(this, model, clipBoard),
    dataAccessObject = new DataAccessObject(this, CONFIRM_DISCARD_CHANGE_MESSAGE)

  let writable = new Writable()

  observe.observeModelChange(model.annotationData, history, writable)
  observe.observeHistorfChange(
    history,
    buttonController.buttonStateHelper,
    CONFIRM_DISCARD_CHANGE_MESSAGE,
    writable
  )
  observe.observeDataSave(dataAccessObject, history, writable)

  // public funcitons of editor
  this.api = {
    start: (editor) => start(
      editor,
      dataAccessObject,
      history,
      buttonController,
      model,
      clipBoard,
      writable
    )
  }

  return this
}
