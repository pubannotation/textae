import {
    EventEmitter
}
from 'events';
import Transition from './Transition';
import setEditModeApi from './setEditModeApi';
import setViewModeApi from './setViewModeApi';
import resetView from './resetView';
import toStateMachine from './toStateMachine';

export default function(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton) {
    let emitter = new EventEmitter(),
        transition = new Transition(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton),
        stateMachine = toStateMachine(transition);

    transition
        .on('show', () => emitter.emit('show'))
        .on('hide', () => emitter.emit('hide'))
        .on('change', () => resetView(typeEditor, model.selectionModel));

    _.extend(emitter, {
        setEditModeApi: () => setEditModeApi(emitter, stateMachine),
        setViewModeApi: () => setViewModeApi(emitter, stateMachine)
    });

    return emitter;
}
