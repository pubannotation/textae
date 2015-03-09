var reduce2hash = require('../reduce2hash'),
    extendBindable = require('../../util/extendBindable'),
    Button = function(buttonName) {
        // Button state is true when the button is pushed.
        var emitter = extendBindable({}),
            state = false,
            value = function(newValue) {
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
            propagate = function() {
                emitter.trigger('change', {
                    buttonName: buttonName,
                    state: state
                });
            };

        return _.extend({
            name: buttonName,
            value: value,
            toggle: toggle,
            propagate: propagate
        }, emitter);
    },
    buttonList = [
        'boundary-detection',
        'negation',
        'replicate-auto',
        'relation-edit-mode',
        'speculation'
    ],
    propagateStateOf = function(emitter, buttons) {
        buttons
            .map(function(button) {
                return {
                    buttonName: button.name,
                    state: button.value()
                };
            })
            .forEach(function(data) {
                emitter.trigger('change', data);
            });
    };

module.exports = function() {
    var emitter = extendBindable({}),
        buttons = buttonList.map(Button),
        propagateStateOfAllButtons = _.partial(propagateStateOf, emitter, buttons),
        buttonHash = buttons.reduce(reduce2hash, {});

    // default pushed;
    buttonHash['boundary-detection'].value(true);

    // Bind events.
    buttons.forEach(function(button) {
        button.bind('change', function(data) {
            emitter.trigger('change', data);
        });
    });

    return _.extend(
        buttonHash,
        emitter, {
            propagate: propagateStateOfAllButtons
        }
    );
};
