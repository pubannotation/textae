import {
    EventEmitter
}
from 'events';
import Transition from './Transition';
import toStateMachine from './toStateMachine';
import resetView from './resetView';
import setEditModeApi from './setEditModeApi';
import setViewModeApi from './setViewModeApi';

export default function(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton) {
    let emitter = new EventEmitter(),
        transition = new Transition(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton),
        stateMachine = toStateMachine(transition);

    transition
        .on('show', () => emitter.emit('showInstance'))
        .on('hide', () => emitter.emit('hideInstance'))
        .on('change', () => resetView(typeEditor, model.selectionModel));

    _.extend(emitter, {
        setEditModeApi: () => setEditModeApi(emitter, stateMachine),
        setViewModeApi: () => setViewModeApi(emitter, stateMachine)
    });

    return emitter;
}
