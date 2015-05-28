import {
    EventEmitter
}
from 'events';
import Transition from './Transition';
import toStateMachine from './toStateMachine';
import resetView from './resetView';
import setEditModeApi from './setEditModeApi';
import setViewModeApi from './setViewModeApi';
import event from './event';
import state from './state';

export default function(editor, model, typeEditor, buttonStateHelper) {
    let emitter = new EventEmitter(),
        transition = new Transition(editor, model, typeEditor, buttonStateHelper),
        stateMachine = toStateMachine(transition);

    transition
        .on(event.SHOW, () => emitter.emit(event.SHOW))
        .on(event.HIDE, () => emitter.emit(event.HIDE))
        .on(event.CHANGE, () => resetView(typeEditor, model.selectionModel))
        .on(event.CHANGE, (editable, mode) => emitter.emit(event.CHANGE, editable, mode));

    _.extend(emitter, {
        toTerm: function() {
            stateMachine.setState(state.TERM);
        },
        toInstance: function() {
            stateMachine.setState(state.INSTANCE);
        },
        toRelation: function() {
            stateMachine.setState(state.RELATION);
        },
        toViewTerm: function() {
            stateMachine.setState(state.VIEW_TERM);
        },
        toViewInstance: function() {
            stateMachine.setState(state.VIEW_INSTANCE);
        }
    }, {
        setEditModeApi: () => setEditModeApi(emitter),
        setViewModeApi: () => setViewModeApi(emitter)
    });

    return emitter;
}
