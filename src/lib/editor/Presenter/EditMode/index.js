import {
    EventEmitter
}
from 'events';
import Transition from './Transition';
import setModeApi from './setModeApi';
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
        setModeApi: (isEditable) => setModeApi(emitter, stateMachine, isEditable)
    });

    return emitter;
}
