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
        .on('showInstance', () => emitter.emit('showInstance'))
        .on('hideInstance', () => emitter.emit('hideInstance'))
        .on('change', () => resetView(typeEditor, model.selectionModel))
        .on('change', (...rest) => console.log(rest));

    _.extend(emitter, {
        setEditModeApi: () => setEditModeApi(emitter, stateMachine),
        setViewModeApi: () => setViewModeApi(emitter, stateMachine)
    });

    return emitter;
}
