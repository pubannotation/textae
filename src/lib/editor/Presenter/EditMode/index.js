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

export default function(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton) {
    let emitter = new EventEmitter(),
        transition = new Transition(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton),
        stateMachine = toStateMachine(transition);

    transition
        .on(event.SHOW, () => emitter.emit(event.SHOW))
        .on(event.HIDE, () => emitter.emit(event.HIDE))
        .on(event.CHANGE, () => resetView(typeEditor, model.selectionModel))
        .on(event.CHANGE, (...rest) => console.log(rest));

    _.extend(emitter, {
        setEditModeApi: () => setEditModeApi(emitter, stateMachine),
        setViewModeApi: () => setViewModeApi(emitter, stateMachine)
    });

    return emitter;
}
