import {
    EventEmitter as EventEmitter
}
from 'events';
import EditRelation from './EditRelation';
import EditEntity from './EditEntity';
import unbindAllEventhandler from './unbindAllEventhandler';

const DEFAULT_HANDLER = {
    changeTypeOfSelected: null,
    getSelectedIdEditable: returnEmptyArray,
    getSelectedType: null,
    // The Reference to content to be shown in the pallet.
    typeContainer: null,
    // A Swithing point to change a behavior when relation is clicked.
    jsPlumbConnectionClicked: null
};

module.exports = function(editor, model, spanConfig, command, modeAccordingToButton, typeContainer) {
    var handler = _.extend({}, DEFAULT_HANDLER),
        emitter = new EventEmitter(),
        cancelSelect = function() {
            emitter.emit('cancel.select');
        },
        noEdit = function() {
            return [() => {}, DEFAULT_HANDLER];
        },
        editRelation = new EditRelation(editor, model.selectionModel, model.annotationData, command, typeContainer, cancelSelect),
        editEntity = new EditEntity(editor, model, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect);

    return _.extend(
        emitter, {
            handler: handler,
            start: {
                noEdit: () => {
                    let newState = noEdit();
                    transit(editor, handler, newState);
                },
                editRelation: () => {
                    let newState = editRelation();
                    transit(editor, handler, newState);
                },
                editEntity: () => {
                    let newState = editEntity();
                    transit(editor, handler, newState);
                }
            }
        }
    );
};

function transit(editor, handler, newState) {
    unbindAllEventhandler(editor);
    newState[0]();
    _.extend(handler, newState[1]);
}

function returnEmptyArray() {
    return [];
}
