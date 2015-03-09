import {
    EventEmitter as EventEmitter
}
from 'events';
import reduce2hash from '../reduce2hash';

const buttonList = [
    'boundary-detection',
    'negation',
    'replicate-auto',
    'relation-edit-mode',
    'speculation'
];

export default function() {
    var emitter = new EventEmitter(),
        buttons = buttonList.map(Button),
        propagateStateOfAllButtons = () => propagateStateOf(emitter, buttons),
        buttonHash = buttons.reduce(reduce2hash, {});

    // default pushed;
    buttonHash['boundary-detection'].value(true);

    // Bind events.
    buttons.forEach(function(button) {
        button.on('change', (data) => emitter.emit('change', data));
    });

    return _.extend(
        emitter,
        buttonHash, {
            propagate: propagateStateOfAllButtons
        }
    );
}

function Button(buttonName) {
    // Button state is true when the button is pushed.
    var emitter = new EventEmitter(),
        state = false,
        value = (newValue) => {
            if (newValue !== undefined) {
                state = newValue;
                propagate();
            } else {
                return state;
            }
        },
        toggle = function toggleButton() {
            state = !state;
            propagate();
        },
        // Propagate button state to the tool.
        propagate = () => emitter.emit('change', {
            buttonName: buttonName,
            state: state
        });

    return _.extend(emitter, {
        name: buttonName,
        value: value,
        toggle: toggle,
        propagate: propagate
    });
}

function propagateStateOf(emitter, buttons) {
    buttons
        .map(toData)
        .forEach((data) => emitter.emit('change', data));
}

function toData(button) {
    return {
        buttonName: button.name,
        state: button.value()
    };
}
