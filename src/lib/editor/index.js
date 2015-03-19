const CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';

import Observable from 'observ';
import DataAccessObject from '../component/DataAccessObject';
import editingState from './editingState';
// model manages data objects.
import Model from './Model';
// The history of command that providing undo and redo.
import History from './History';
import ButtonController from './ButtonController';
import start from './start';
import Writable from './Writable';

export default function() {
    let self = this,
        model = new Model(this),
        history = new History(),
        clipBoard = {
            // clipBoard has entity type.
            clipBoard: []
        },
        buttonController = new ButtonController(this, model, clipBoard),
        dataAccessObject = new DataAccessObject(self, CONFIRM_DISCARD_CHANGE_MESSAGE);

    let writable = new Writable();
    writable(val => buttonController.buttonStateHelper.enabled("write", val));

    editingState(
        model.annotationData,
        history,
        buttonController.buttonStateHelper,
        CONFIRM_DISCARD_CHANGE_MESSAGE,
        dataAccessObject,
        writable
    );

    // public funcitons of editor
    this.api = {
        start: (editor) => start(
            editor,
            dataAccessObject,
            history,
            buttonController,
            model,
            clipBoard
        )
    };

    return this;
}
