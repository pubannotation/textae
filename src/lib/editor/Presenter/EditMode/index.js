import {
    EventEmitter
}
from 'events';
import Transition from './Transition';
import bindTransition from './bindTransition';
import resetView from './resetView';
import event from './event';
import Trigger from './Trigger';
import enableButtonHasAnnotation from './enableButtonHasAnnotation';

export default function(editor, model, typeEditor, buttonStateHelper) {
    let emitter = new EventEmitter(),
        transition = new Transition(editor, model, typeEditor, buttonStateHelper),
        stateMachine = bindTransition(transition),
        trigger = new Trigger(stateMachine);

    stateMachine.once('transition', () => enableButtonHasAnnotation(buttonStateHelper));

    transition
        .on(event.SHOW, () => emitter.emit(event.SHOW))
        .on(event.HIDE, () => emitter.emit(event.HIDE))
        .on(event.CHANGE, () => resetView(typeEditor, model.selectionModel))
        .on(event.CHANGE, (editable, mode) => emitter.emit(event.CHANGE, editable, mode));

    _.extend(emitter, trigger);

    return emitter;
}
